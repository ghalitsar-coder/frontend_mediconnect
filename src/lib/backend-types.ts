// backend-types.ts
// Type definitions matching the Go backend domain models and API responses

// ─── User & Auth ──────────────────────────────────────────────────────────────

export type UserRole = 'PATIENT' | 'NAKES' | 'DINKES';

export interface BackendUser {
  id: string;
  nik: string;
  email: string;
  phone?: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BackendAuthResponse {
  token: string;
  user: BackendUser;
}

// ─── Facility ─────────────────────────────────────────────────────────────────

export type FacilityType = 'PUSKESMAS' | 'KLINIK';

export interface BackendFacility {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type: FacilityType;
  district_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Doctor ───────────────────────────────────────────────────────────────────

export interface BackendDoctor {
  id: string;
  facility_id: string;
  name: string;
  spec: string;       // specialization
  poli: string;
  rating: number;
  patients: number;
}

export interface BackendDoctorSchedule {
  id: string;
  doctor_id: string;
  day_of_week: number; // 0=Minggu, 6=Sabtu
  start_time: string;
  end_time: string;
  slot_duration_minutes: number;
  max_patients: number;
}

export interface BackendSlot {
  time: string;
  isAvailable: boolean;
}

// ─── Booking ──────────────────────────────────────────────────────────────────

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'DONE' | 'CANCELLED';

export interface BackendBookingRequest {
  facility_id: string;
  doctor_id: string;
  schedule_date: string; // "YYYY-MM-DD"
  schedule_time: string; // "HH:mm"
}

export interface BackendBookingResponse {
  booking_id: string;
  token: string;
  no_antrian: string;
}
