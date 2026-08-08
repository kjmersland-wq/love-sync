import { NextResponse } from "next/server";
import { sendContactEmail } from "../../../lib/contact/email";
import { validateContactConfig } from "../../../lib/contact/validation";

const ALLOWED_INQUIRY_TYPES = new Set([
  "general",
  "support",
  "partnership",
  "business",
  "pricing",
  "other",
]);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

// Best-effort in-memory rate limiter. Resets when the Worker isolate recycles;
// combined with the honeypot and optional Turnstile check below for defense in depth.
const rateLimitStore = new Map<string, { count: number; windowStart: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(ip, { count: 1, windowStart: now });
    return false;
  }

  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX_REQUESTS;
}

async function verifyTurnstileToken(token: string, secretKey: string, ip: string): Promise<boolean> {
  try {
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token);
    formData.append("remoteip", ip);

    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
    });
    const data = await res.json().catch(() => null);
    return !!data?.success;
  } catch (e) {
    console.error("[Contact API] Turnstile verification request failed:", e);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many requests",
          details: "You've submitted too many messages recently. Please try again later.",
        },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const {
      name,
      email,
      phone,
      company,
      inquiryType,
      message,
      consent,
      website, // honeypot field - real users never fill this in
      turnstileToken,
    } = body || {};

    // Honeypot: silently pretend success so bots don't learn to avoid this field
    if (typeof website === "string" && website.trim().length > 0) {
      return NextResponse.json({ success: true });
    }

    const errors: Record<string, string> = {};

    if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 100) {
      errors.name = "Please enter your full name (2-100 characters).";
    }
    if (typeof email !== "string" || !EMAIL_REGEX.test(email.trim()) || email.trim().length > 200) {
      errors.email = "Please enter a valid email address.";
    }
    if (phone !== undefined && phone !== null && phone !== "" && (typeof phone !== "string" || phone.trim().length > 40)) {
      errors.phone = "Please enter a valid phone number.";
    }
    if (company !== undefined && company !== null && company !== "" && (typeof company !== "string" || company.trim().length > 150)) {
      errors.company = "Company name is too long.";
    }
    if (typeof inquiryType !== "string" || !ALLOWED_INQUIRY_TYPES.has(inquiryType)) {
      errors.inquiryType = "Please select a valid inquiry type.";
    }
    if (typeof message !== "string" || message.trim().length < 10 || message.trim().length > 4000) {
      errors.message = "Please enter a message between 10 and 4000 characters.";
    }
    if (consent !== true) {
      errors.consent = "Please confirm you agree to be contacted about this inquiry.";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: "Please correct the highlighted fields.",
          fieldErrors: errors,
        },
        { status: 400 }
      );
    }

    const config = validateContactConfig();
    if (config.values.turnstileSecretKey) {
      if (typeof turnstileToken !== "string" || !turnstileToken) {
        return NextResponse.json(
          {
            success: false,
            error: "Verification required",
            details: "Please complete the human verification challenge.",
          },
          { status: 400 }
        );
      }
      const verified = await verifyTurnstileToken(turnstileToken, config.values.turnstileSecretKey, ip);
      if (!verified) {
        return NextResponse.json(
          {
            success: false,
            error: "Verification failed",
            details: "We couldn't verify you're human. Please try again.",
          },
          { status: 400 }
        );
      }
    }

    await sendContactEmail({
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : undefined,
      company: company ? company.trim() : undefined,
      inquiryType,
      message: message.trim(),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[Contact API Error]:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send message",
        details: "Something went wrong on our end. Please try again shortly, or reach out via a different channel.",
      },
      { status: 500 }
    );
  }
}
