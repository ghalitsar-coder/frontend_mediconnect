import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function decodeJwtPayload(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Mengambil token dari cookies (sebelumnya ketika login/regis pastikan diset sebagai cookie 'token')
  const tokenCookie = request.cookies.get('token');
  const token = tokenCookie?.value; 

  // ----- GUARD: AKSES /dashboard -----
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      // Belum login -> suruh login
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Decode token untuk mendapatkan role
    const payload = decodeJwtPayload(token);
    if (!payload || payload.role === 'PATIENT' || payload.role === 'patient') {
      // Jika patient atau token invalid -> lempar ke homepage (atau halaman lain)
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // ----- GUARD: AKSES /login ATAU /register KALAU SUDAH LOGIN -----
  if ((pathname.startsWith('/login') || pathname.startsWith('/register')) && token) {
    // Kalau sudah punya token (udah login), cegah buka /login dan lempar ke /dashboard
    // (Bisa juga check role di sini jika patient mau dilempar ke / alih-alih /dashboard)
    const payload = decodeJwtPayload(token);
    if (payload && (payload.role === 'PATIENT' || payload.role === 'patient')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
