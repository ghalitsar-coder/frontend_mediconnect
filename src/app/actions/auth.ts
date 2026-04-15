"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// Helper sederhana untuk decode token payload di server (jangan dicopy ke client actions tanpa pengecekan aman)
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

export async function loginAction(data: any) {
  try {
    const response = await fetch("http://localhost:8080/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      return { error: result.message || "Failed to login" }
    }

    const cookieStore = await cookies()
    
    // Set cookie server-side (HttpOnly)
    cookieStore.set("token", result.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    })

    return { success: true }
  } catch (error: any) {
    return { error: error.message || "Failed to connect to server" }
  }
}

export async function getUserAction() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) return null

  const payload = decodeJwtPayload(token)
  if (!payload) return null

  // Payload structure dari Golang API
  return {
    user_id: payload.user_id,
    role: payload.role,
    // Jika backend mengirim informasi tambahan di JWT, kamu bisa tambahkan di sini
  }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete("token")
  redirect("/")
}