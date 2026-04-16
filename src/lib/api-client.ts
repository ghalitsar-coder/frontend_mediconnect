/**
 * api-client.ts
 * HTTP client terpusat untuk Mediconnect frontend.
 *
 * Arsitektur cookie auth:
 *  - HttpOnly `token`      → JWT, tidak terbaca JS, dikirim otomatis via credentials:'include'
 *  - Non-HttpOnly `auth_session=1` → flag login, dibaca proxy.ts di Edge
 *  - Non-HttpOnly `user_role`      → dibaca proxy.ts untuk routing per-role
 *
 * Client ini TIDAK menyimpan token di localStorage.
 * Token dikirim backend melalui Set-Cookie HttpOnly, dan ikut ter-send
 * otomatis di setiap request karena `credentials: 'include'`.
 */

import type {
  BackendAuthResponse,
  BackendFacility,
  BackendDoctor,
  BackendSlot,
  BackendBookingRequest,
  BackendBookingResponse,
  BackendBookingDetail,
} from './backend-types';

// ─── Base URL ─────────────────────────────────────────────────────────────────

const RAW_API_URL = process.env.NODE_ENV === 'production'
  ? process.env.NEXT_PUBLIC_API_URL
  : 'http://localhost:8080/api/v1';

const API_BASE_URL = RAW_API_URL?.endsWith('/api/v1')
  ? RAW_API_URL
  : `${RAW_API_URL?.replace(/\/$/, '')}/api/v1`;

// ─── Response envelope ────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, string>;
  };
  meta?: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

// ─── Custom error class ───────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: Record<string, string>,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }

  isUnauthorized() { return this.statusCode === 401 || this.code === 'UNAUTHORIZED'; }
  isForbidden() { return this.statusCode === 403 || this.code === 'FORBIDDEN'; }
  isNotFound() { return this.statusCode === 404 || this.code === 'NOT_FOUND'; }
  isValidation() { return this.code === 'VALIDATION_ERROR'; }
}

// ─── Auth session markers (non-HttpOnly, dibaca proxy.ts) ─────────────────────

export const AUTH_SESSION_COOKIE = 'auth_session';
const AUTH_SESSION_MAX_AGE = 60 * 60 * 24; // 1 hari, sama dengan token

/** Set setelah login sukses — informasikan proxy.ts bahwa user sudah login */
export function markAuthSessionPresent(role: string): void {
  if (typeof document === 'undefined') return;
  const opts = `path=/; max-age=${AUTH_SESSION_MAX_AGE}; SameSite=Lax`;
  document.cookie = `${AUTH_SESSION_COOKIE}=1; ${opts}`;
  document.cookie = `user_role=${role}; ${opts}`;
}

/** Hapus session markers saat logout (partner dari logoutAction di server) */
export function clearAuthSessionMarkers(): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${AUTH_SESSION_COOKIE}=; path=/; max-age=0`;
  document.cookie = `user_role=; path=/; max-age=0`;
}

/** Cek apakah ada session aktif (bisa dipakai di client component untuk hide/show UI) */
export function hasActiveSession(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie.split(';').some((c) => c.trim().startsWith(`${AUTH_SESSION_COOKIE}=1`));
}

// ─── Request config ───────────────────────────────────────────────────────────

interface RequestConfig extends RequestInit {
  timeout?: number;
  isFormData?: boolean;
}

// ─── Core request function ────────────────────────────────────────────────────

async function request<T>(endpoint: string, options: RequestConfig = {}): Promise<T> {
  const { timeout = 30_000, isFormData, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const headers: Record<string, string> = {
      ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
    };

    if (fetchOptions.headers) {
      Object.assign(headers, fetchOptions.headers);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
      signal: controller.signal,
      // Kirim HttpOnly cookie otomatis ke backend (same-origin atau CORS dengan allow-credentials)
      credentials: 'include',
    });

    clearTimeout(timeoutId);

    if (response.status === 204) {
      return undefined as T;
    }

    let json: ApiResponse<T>;
    try {
      json = await response.json();
    } catch {
      throw new ApiError('PARSE_ERROR', 'Failed to parse server response', undefined, response.status);
    }

    if (!response.ok || json.status === 'error') {
      // 401: session expired → clear markers dan redirect ke login
      if (response.status === 401) {
        clearAuthSessionMarkers();
        if (typeof window !== 'undefined' &&
          !window.location.pathname.startsWith('/login')) {
          window.location.assign('/login');
        }
        throw new ApiError('UNAUTHORIZED', 'Session expired. Please log in again.', undefined, 401);
      }

      throw new ApiError(
        json.error?.code || 'UNKNOWN_ERROR',
        json.error?.message || json.message || 'An error occurred',
        json.error?.details,
        response.status
      );
    }

    return json.data as T;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) throw error;

    if (error instanceof Error) {
      if (error.name === 'AbortError') throw new ApiError('TIMEOUT', 'Request timed out');
      throw new ApiError('NETWORK_ERROR', error.message);
    }

    throw new ApiError('UNKNOWN_ERROR', 'An unknown error occurred');
  }
}

// ─── Generic HTTP methods ─────────────────────────────────────────────────────

const http = {
  get: <T>(endpoint: string, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: 'POST', body: body ? JSON.stringify(body) : undefined }),

  put: <T>(endpoint: string, body?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: 'PUT', body: body ? JSON.stringify(body) : undefined }),

  patch: <T>(endpoint: string, body?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),

  delete: <T>(endpoint: string, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: 'DELETE' }),

  upload: <T>(endpoint: string, formData: FormData, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: 'POST', body: formData, isFormData: true }),
};

// ─── Typed API endpoints ──────────────────────────────────────────────────────

export const api = {
  // ── Auth ──────────────────────────────────────────────────────────────────
  auth: {
    /**
     * Login — backend set HttpOnly `token` via Set-Cookie.
     * Setelah berhasil, panggil markAuthSessionPresent(role) untuk set non-HttpOnly flags.
     */
    login: (data: { email: string; password: string }) =>
      http.post<BackendAuthResponse>('/auth/login', data, { credentials: 'include' } as RequestConfig),

    /**
     * Register akun baru.
     */
    register: (data: {
      nik: string;
      email: string;
      password: string;
      phone?: string;
      full_name: string;
      role?: 'PATIENT' | 'NAKES' | 'DINKES';
    }) => http.post<null>('/auth/register', data),

    /**
     * Logout — backend clear HttpOnly cookie via Set-Cookie.
     * Setelah berhasil, panggil clearAuthSessionMarkers() untuk hapus non-HttpOnly flags.
     */
    logout: () =>
      http.post<null>('/auth/logout', {}, { credentials: 'include' } as RequestConfig),
  },

  // ── Facilities ────────────────────────────────────────────────────────────
  facilities: {
    /**
     * Ambil daftar fasilitas kesehatan.
     * @param filter - Optional filter: district_id, type ('PUSKESMAS' | 'KLINIK')
     */
    list: (filter?: { district_id?: string; type?: 'PUSKESMAS' | 'KLINIK' }) => {
      const params = new URLSearchParams();
      if (filter?.district_id) params.set('district_id', filter.district_id);
      if (filter?.type) params.set('type', filter.type);
      const query = params.toString() ? `?${params.toString()}` : '';
      return http.get<BackendFacility[]>(`/facilities${query}`);
    },
  },

  // ── Doctors ───────────────────────────────────────────────────────────────
  doctors: {
    /**
     * Ambil daftar dokter, optionally filter by facility_id dan poli.
     */
    list: (filter?: { facility_id?: string; poli?: string }) => {
      const params = new URLSearchParams();
      if (filter?.facility_id) params.set('facility_id', filter.facility_id);
      if (filter?.poli) params.set('poli', filter.poli);
      const query = params.toString() ? `?${params.toString()}` : '';
      return http.get<BackendDoctor[]>(`/doctors${query}`);
    },

    /**
     * Ambil slot waktu tersedia untuk dokter pada tanggal tertentu.
     * @param doctorId - UUID dokter
     * @param date     - Format "YYYY-MM-DD"
     */
    slots: (doctorId: string, date: string) =>
      http.get<BackendSlot[]>(`/doctors/${doctorId}/slots?date=${date}`),
  },

  // ── Bookings ──────────────────────────────────────────────────────────────
  bookings: {
    /**
     * Buat booking baru (memerlukan autentikasi PATIENT).
     * HttpOnly cookie `token` otomatis dikirim via credentials:'include'.
     */
    create: (data: BackendBookingRequest) =>
      http.post<BackendBookingResponse>('/bookings', data),

    /**
     * Ambil daftar booking milik user saat ini
     */
    list: () => http.get<BackendBookingDetail[]>('/bookings'),
  },

  // ── Health check ──────────────────────────────────────────────────────────
  health: {
    check: () => http.get<{ status: string }>('/health'),
  },
};

// ─── Re-exports ───────────────────────────────────────────────────────────────
export type { RequestConfig };
export { http };