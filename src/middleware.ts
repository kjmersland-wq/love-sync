import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'no', 'pl', 'de', 'fr', 'es', 'it'];
const defaultLocale = 'en';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the pathname has a supported locale prefix (e.g. /en, /no, /pl)
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Avoid redirecting assets, favicon, API, or private internals
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return;
  }

  // Redirect to the default locale
  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Matches all paths except those starting with _next, api, or having extensions
    '/((?!_next|api|.*\\.).*)',
  ],
};
