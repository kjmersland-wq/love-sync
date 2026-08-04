import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { paymentService } from "../../../../lib/payments/paymentService";



export async function POST(request: Request) {
  try {
    const userIdCookie = request.headers.get("Cookie")
      ?.split(";")
      .find((c) => c.trim().startsWith("ls_user_id="));
    
    const userId = userIdCookie ? userIdCookie.split("=")[1].trim() : null;

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: "Unauthorized user",
        details: "No user session cookie found."
      });
    }

    const { planId, amount } = await payloadJson(request);

    if (!planId) {
      return NextResponse.json({
        success: false,
        error: "planId is required",
        details: "Missing price/plan ID in checkout request."
      });
    }

    const returnUrl = new URL(request.url).origin + "/pricing";

    // Generate secure transaction session
    const session = await paymentService.createCheckoutSession(
      userId,
      planId,
      amount || 14.99,
      "USD",
      returnUrl,
      "paddle"
    );

    return NextResponse.json({
      success: true,
      transactionId: session.id,
      checkoutUrl: session.url
    });
  } catch (error: any) {
    console.error("[Paddle Checkout API Error] Real server error:", error);
    
    let details = error.message;
    try {
      const parsed = JSON.parse(error.message);
      details = parsed.error?.detail || parsed.error?.message || error.message;
    } catch (e) {}

    return NextResponse.json({
      success: false,
      error: "Failed to create checkout session",
      details: details
    });
  }
}

async function payloadJson(request: Request) {
  try {
    return await request.json();
  } catch (e) {
    return {};
  }
}
