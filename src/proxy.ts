import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ─── Proxy: auth guard berbasis cookie flag (Edge Runtime compatible) ─────────
//
// Pattern:
//  - Backend set HttpOnly `token` (JWT) — tidak terbaca JS/Edge
//  - Backend juga set NON-HttpOnly `auth_session=1` — terbaca proxy di Edge
//  - Backend juga set NON-HttpOnly `user_role=PATIENT|NAKES|DINKES` — untuk routing
//  - Saat logout: semua cookie di-clear oleh backend atau logoutAction
//
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Baca flag session (non-HttpOnly, bisa dibaca Edge)
  const isAuthenticated = request.cookies.get('auth_session')?.value === '1';
  const role = request.cookies.get('user_role')?.value?.toUpperCase() ?? null;

  // ─── Guard: /dashboard (NAKES & DINKES only) ─────────────────────────────
  if (pathname.startsWith('/dashboard')) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (role === 'PATIENT') {
      // Patient tidak boleh masuk dashboard
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  }

  // ─── Guard: /booking (PATIENT only) ──────────────────────────────────────
  if (pathname.startsWith('/booking')) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (role && role !== 'PATIENT') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
  }

  // ─── Guard: /profile (semua role, harus login) ────────────────────────────
  if (pathname.startsWith('/profile')) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // ─── Guard: /login & /register — kalau sudah login, redirect sesuai role ──
  if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
    if (isAuthenticated) {
      if (role === 'PATIENT') {
        return NextResponse.redirect(new URL('/', request.url));
      }
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

// Matcher: semua path kecuali static assets
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};