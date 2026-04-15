// lib/auth.ts — BUKAN Server Action, fungsi biasa untuk Server Components
// Aman dipanggil langsung dari Server Component tanpa POST request overhead
import { cookies } from "next/headers"

function decodeJwtPayload(token: string): { user_id: string; role: string; exp: number } | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    if (payload.exp && Date.now() / 1000 > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

// Panggil ini di Server Component langsung — tidak via POST, tidak ada infinite loop
export async function getCurrentUser(): Promise<{ user_id: string; role: string } | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value
  if (!token) return null
  const payload = decodeJwtPayload(token)
  if (!payload) return null
  return { user_id: payload.user_id, role: payload.role }
}
