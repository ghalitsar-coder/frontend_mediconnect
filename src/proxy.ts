import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Mengambil token dari cookies (sebelumnya ketika login/regis pastikan diset sebagai cookie 'token')
  const tokenCookie = request.cookies.get('token');
  const token = tokenCookie?.value; 

  // ----- GUARD: AKSES /dashboard -----
  // Mulai sekarang: asal punya token, boleh masuk dashboard (bebas role)
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      // Belum login -> suruh login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // ----- GUARD: AKSES /login ATAU /register KALAU SUDAH LOGIN -----
  if ((pathname.startsWith('/login') || pathname.startsWith('/register')) && token) {
    // Kalau sudah punya token (udah login), cegah buka /login dan lempar ke /dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
