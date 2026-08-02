import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "no", "pl", "de", "fr", "es", "it"];
const defaultLocale = "en";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const cleanHost = host.split(":")[0].toLowerCase().trim();
  const proto = request.headers.get("x-forwarded-proto") || "https";

  // 1. Permanent redirect to canonical secure www domain (https://www.love-sync.com)
  // Redirect if visiting non-www (love-sync.com) or visiting insecure www (http://www.love-sync.com)
  if (cleanHost === "love-sync.com" || (cleanHost === "www.love-sync.com" && proto === "http")) {
    return NextResponse.redirect(
      `https://www.love-sync.com${request.nextUrl.pathname}${request.nextUrl.search}`,
      308
    );
  }

  const { pathname } = request.nextUrl;

  // 2. Check if the pathname has a supported locale prefix (e.g. /en, /no, /pl)
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

  // 3. Redirect to the default locale (/en)
  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Matches all paths except those starting with _next, api, or having extensions
    "/((?!_next|api|.*\\.).*)",
  ],
};
