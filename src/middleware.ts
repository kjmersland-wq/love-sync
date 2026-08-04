import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

const locales = ["en", "no", "pl", "de", "fr", "es", "it"];
const defaultLocale = "en";

function getD1(): any {
  try {
    const context = getCloudflareContext();
    if (context && context.env && context.env.DB) {
      return context.env.DB;
    }
  } catch (e) {
    // Suppress warning during static building / SSR outside Workers
  }
  return null;
}

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const cleanHost = host.split(":")[0].toLowerCase().trim();
  const proto = request.headers.get("x-forwarded-proto") || "https";

  // 1. Permanent redirect to canonical secure www domain (https://www.love-sync.com)
  if (cleanHost === "love-sync.com" || (cleanHost === "www.love-sync.com" && proto === "http")) {
    return NextResponse.redirect(
      `https://www.love-sync.com${request.nextUrl.pathname}${request.nextUrl.search}`,
      308
    );
  }

  const { pathname } = request.nextUrl;

  // 2. Feature Gating for Premium-only routes
  const premiumRoutes = ["/compare", "/messages", "/properties", "/property", "/dashboard", "/onboarding", "/verify", "/admin"];
  const isPremiumRoute = premiumRoutes.some((route) => pathname.includes(route));

  if (isPremiumRoute) {
    const userId = request.cookies.get("ls_user_id")?.value;
    let isPremium = false;

    if (userId) {
      const d1 = getD1();
      if (d1) {
        try {
          const user = await d1.prepare("SELECT subscription, paddle_renewal_date FROM users WHERE id = ?").bind(userId).first();
          if (user && user.subscription === "Premium") {
            // Subscription expiry checking
            const renewalDateStr = user.paddle_renewal_date;
            if (renewalDateStr) {
              const renewalDate = new Date(renewalDateStr);
              if (renewalDate.getTime() > Date.now()) {
                isPremium = true;
              } else {
                console.log(`[Middleware Premium Expiry] User ${userId} subscription expired on ${renewalDateStr}.`);
              }
            } else {
              // If there's no renewal date set but status is active (e.g. lifetime or local dev test)
              isPremium = true;
            }
          }
        } catch (e) {
          console.error("Middleware D1 read error:", e);
        }
      } else {
        // Fallback for local development or static builds: allow access
        isPremium = true;
      }
    }

    if (!isPremium) {
      // Find the locale from path to preserve it in redirect destination
      const segmentLocale = locales.find((l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`);
      const locale = segmentLocale || defaultLocale;
      console.log(`[Middleware Access Blocked] Gated premium route: ${pathname}. Redirecting to /${locale}/pricing`);
      return NextResponse.redirect(new URL(`/${locale}/pricing`, request.url));
    }
  }

  // 3. Check if the pathname has a supported locale prefix (e.g. /en, /no, /pl)
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Avoid redirecting assets, favicon, API, or private internals
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return;
  }

  // 4. Redirect to the default locale (/en)
  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Matches all paths except those starting with _next, api, or having extensions
    "/((?!_next|api|.*\\.).*)",
  ],
};
