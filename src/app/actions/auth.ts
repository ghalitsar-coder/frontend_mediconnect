"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// ─── Helper: decode JWT payload (server-side only) ───────────────────────────
function decodeJwtPayload(token: string): { user_id: string; role: string; exp: number } | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    // Cek expiry
    if (payload.exp && Date.now() / 1000 > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

// ─── Login ────────────────────────────────────────────────────────────────────
export async function loginAction(data: { email: string; password: string }) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"
  try {
    const response = await fetch(`${apiUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      cache: "no-store",
    })

    const result = await response.json()

    if (!response.ok) {
      return { error: result.message || "Failed to login" }
    }

    const cookieStore = await cookies()
    const maxAge = 60 * 60 * 24 // 1 day
    const role: string = result.data.user?.role ?? "PATIENT"

    // 1. HttpOnly JWT — tidak terbaca JS/browser, aman dari XSS
    cookieStore.set("token", result.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge,
      path: "/",
    })

    // 2. auth_session flag — non-HttpOnly, dibaca proxy.ts di Edge
    cookieStore.set("auth_session", "1", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge,
      path: "/",
    })

    // 3. user_role — non-HttpOnly, dibaca proxy.ts untuk routing per-role
    cookieStore.set("user_role", role, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge,
      path: "/",
    })

    return { success: true, role }
  } catch (error: unknown) {
    const err = error as Error
    return { error: err.message || "Failed to connect to server" }
  }
}


// ─── Logout ───────────────────────────────────────────────────────────────────
export async function logoutAction() {
  const cookieStore = await cookies()

  // ── 1. Hit backend /auth/logout ───────────────────────────────────────────
  // Penting: backend akan mengirim Set-Cookie dengan MaxAge=-1 untuk semua
  // auth cookies (token, auth_session, user_role). Ini yang benar-benar
  // menghapus cookie di browser. Tanpa langkah ini, auth_session & user_role
  // masih tersisa di browser sehingga proxy.ts tetap redirect ke /dashboard.
  const token = cookieStore.get("token")?.value
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"

  try {
    await fetch(`${apiUrl}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Kirim JWT HttpOnly token agar backend bisa invalidate jika perlu
        ...(token ? { Cookie: `token=${token}` } : {}),
      },
      cache: "no-store",
    })
  } catch {
    // Tetap lanjutkan logout lokal meskipun backend tidak bisa dihubungi
  }

  // ── 2. Hapus semua cookies di sisi Next.js server ─────────────────────────
  // maxAge: -1 → instruksi browser untuk langsung menghapus cookie
  const deleteOpts = {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: -1,
    path: "/",
  }
  cookieStore.set("token",        "", { ...deleteOpts, httpOnly: true })
  cookieStore.set("auth_session", "", { ...deleteOpts, httpOnly: false })
  cookieStore.set("user_role",    "", { ...deleteOpts, httpOnly: false })

  redirect("/")
}