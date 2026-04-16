"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

 

// ─── Login ────────────────────────────────────────────────────────────────────
export async function loginAction(data: { email: string; password: string }) {
  const RAW_API_URL = process.env.NODE_ENV === 'production'
  ? process.env.NEXT_PUBLIC_API_URL
  : 'http://localhost:8080/api/v1';

const API_BASE_URL = RAW_API_URL?.endsWith('/api/v1')
  ? RAW_API_URL
  : `${RAW_API_URL?.replace(/\/$/, '')}/api/v1`;

// ─── Response envelope ───
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
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
// auth.ts - logoutAction yang sudah diperbaiki
export async function logoutAction() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"

  try {
    // ✅ Kirim request dengan credentials: 'include' agar browser otomatis
    //    mengirim semua cookie (termasuk HttpOnly) ke backend
    const response = await fetch(`${apiUrl}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // 🔑 KRUSIAL: kirim HttpOnly cookie otomatis
      cache: "no-store",
    })

    // Opsional: cek response untuk debugging
    if (!response.ok) {
      console.error("Logout API error:", response.status)
    }
  } catch (error) {
    console.error("Logout fetch failed:", error)
    // Tetap lanjutkan untuk menghapus cookie lokal
  }

  // Hapus cookie di sisi Next.js (untuk berjaga-jaga)
  const cookieStore = await cookies()
  const deleteOpts = {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: -1,
    path: "/",
  }
  
  cookieStore.set("token", "", { ...deleteOpts, httpOnly: true })
  cookieStore.set("auth_session", "", { ...deleteOpts, httpOnly: false })
  cookieStore.set("user_role", "", { ...deleteOpts, httpOnly: false })

  // Redirect ke halaman utama
  redirect("/")
}