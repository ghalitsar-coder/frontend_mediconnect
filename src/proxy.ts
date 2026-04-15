import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Helper function to decode JWT payload without verifying signature di edge runtime
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

export function proxy(request: NextRequest) {
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

    const payload = decodeJwtPayload(token);
    
    // Asumsi dari backend auth_usecase.go (claims memiliki "role": user.Role)
    // Di backend ada role PATIENT vs ADMIN (atau SUPERADMIN jika ada)
    if (!payload || (payload.role !== 'ADMIN' && payload.role !== 'SUPERADMIN')) {
      // Jika role bukan admin/superadmin (berarti PATIENT/user biasa), lempar ke ROOT "/"
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // ----- GUARD: AKSES /login ATAU /register KALAU SUDAH LOGIN -----
  if ((pathname.startsWith('/login') || pathname.startsWith('/register')) && token) {
    const payload = decodeJwtPayload(token);
    
    if (payload) {
      // Admin kita arahin masuk dashboard, patient kita arahin masuk root "/"
      if (payload.role === 'ADMIN' || payload.role === 'SUPERADMIN') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      } else {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
