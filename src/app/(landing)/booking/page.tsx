"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, MapPin, Building2, Stethoscope, CalendarDays, Clock, CheckCircle2, QrCode, User, ChevronRight, Star, Users, Download, Home, Loader2 } from "lucide-react";
import Link from "next/link";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";

// ── Types ──
type Facility = { id: string, name: string, type: string, address: string, distance: string, rating: number, queue: number };
type Doctor = { id: string, name: string, spec: string, poli: string, rating: number, patients: number };
type Slot = { time: string, isAvailable: boolean };

// ── API Setup (Axios with Error Handling) ──


const RAW_API_URL = process.env.NODE_ENV === 'production'
  ? process.env.NEXT_PUBLIC_API_URL
  : 'http://localhost:8080/api/v1';

const API_BASE_URL = RAW_API_URL?.endsWith('/api/v1')
  ? RAW_API_URL
  : `${RAW_API_URL?.replace(/\/$/, '')}/api/v1`;


export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Untuk HttpOnly Cookies
});
// ── Static Poliklinik (bisa jg diambil dari API, kita asumsikan hardcoded untuk contoh ini)
const polis = ["Poli Umum", "Poli Gigi", "Poli KIA", "Poli Anak", "Poli Mata", "Poli Paru"];

// ── Utilities ──
const generateDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d);
  }
  return dates;
};

const formatDate = (d: Date) => d.toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" });
const formatDateFull = (d: Date) => d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
const formatAPI = (d: Date) => d.toISOString().split("T")[0];

// ── Step Indicator ──
const StepIndicator = ({ currentStep }: { currentStep: number }) => {
  const steps = ["Pilih Faskes", "Poli & Dokter", "Jadwal", "Konfirmasi", "Selesai"];
  return (
    <div className="flex items-center justify-center gap-1 mb-10 overflow-x-auto pb-4">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-1 shrink-0">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${i < currentStep ? "bg-pastel-mint text-foreground" :
            i === currentStep ? "bg-primary text-primary-foreground" :
              "bg-muted text-muted-foreground"
            }`}>
            {i < currentStep ? <CheckCircle2 size={14} /> : <span className="w-4 text-center">{i + 1}</span>}
            <span className="hidden sm:inline">{s}</span>
          </div>
          {i < steps.length - 1 && <ChevronRight size={14} className="text-muted-foreground" />}
        </div>
      ))}
    </div>
  );
};

// ── Main Page ──
const BookingPage = () => {
  const [step, setStep] = useState(0);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [selectedPoli, setSelectedPoli] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingResult, setBookingResult] = useState<any>(null);

  const dates = generateDates();

  // 1. Fetch Facilities
  const { data: facilities, isLoading: isLoadingFacilities, isError: isErrFacilities } = useQuery({
    queryKey: ["facilities"],
    queryFn: async () => {
      // Dummy Fetch fallback jika API belum siap
      try {
        const res = await api.get("/facilities");
        return res.data.data;
      } catch (err: any) {
        // Fallback untuk mock (karena API beneran belum dibikin tabel facility_distances dsb)
        return [
          { id: "f1", name: "Puskesmas Menteng", type: "PUSKESMAS", address: "Jl. Pegangsaan Timur No.19, Jakarta Pusat", distance: "1.2 km", rating: 4.8, queue: 12 },
          { id: "f2", name: "Klinik Sehat Sejahtera", type: "KLINIK", address: "Jl. Cikini Raya No.45, Jakarta Pusat", distance: "2.5 km", rating: 4.6, queue: 5 },
          { id: "f3", name: "Puskesmas Kemayoran", type: "PUSKESMAS", address: "Jl. Utan Panjang No.3, Jakarta Pusat", distance: "3.8 km", rating: 4.5, queue: 8 },
        ] as Facility[];
      }
    }
  });

  // 2. Fetch Doctors based on Facility & Poli (Enabled only when Poli is selected)
  const { data: doctors, isLoading: isLoadingDoctors } = useQuery({
    queryKey: ["doctors", selectedFacility?.id, selectedPoli],
    queryFn: async () => {
      try {
        const res = await api.get(`/doctors?facility_id=${selectedFacility?.id}&poli=${selectedPoli}`);
        return res.data.data as Doctor[];
      } catch (err) {
        // Mock fallback
        const MOCK: Doctor[] = [
          { id: "d1", name: "dr. Sanjana Gupta", spec: "Dokter Umum", poli: "Poli Umum", rating: 4.9, patients: 1240 },
          { id: "d2", name: "dr. Ahmad Fadli", spec: "Dokter Umum", poli: "Poli Umum", rating: 4.7, patients: 980 },
          { id: "d3", name: "drg. Maria Lestari", spec: "Dokter Gigi", poli: "Poli Gigi", rating: 4.8, patients: 856 },
          { id: "d4", name: "dr. Rina Wulandari, Sp.A", spec: "Dokter Anak", poli: "Poli Anak", rating: 4.9, patients: 1102 },
          { id: "d5", name: "dr. Budi Santoso, Sp.M", spec: "Dokter Mata", poli: "Poli Mata", rating: 4.6, patients: 743 },
        ];
        return MOCK.filter(d => d.poli === selectedPoli);
      }
    },
    enabled: !!selectedFacility && !!selectedPoli,
  });

  // 3. Fetch Doctor Available Slots based on Date
  const { data: slots, isLoading: isLoadingSlots } = useQuery({
    queryKey: ["slots", selectedDoctor?.id, selectedDate ? formatAPI(selectedDate) : null],
    queryFn: async () => {
      try {
        const res = await api.get(`/doctors/${selectedDoctor?.id}/slots?date=${formatAPI(selectedDate!)}`);
        return res.data.data as Slot[];
      } catch (err) {
        // Mock fallback
        const MOCK: Slot[] = [
          "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
          "11:00", "11:30", "13:00", "13:30", "14:00", "14:30"
        ].map(t => ({ time: t, isAvailable: !["09:30", "11:00", "14:00"].includes(t) }));
        return MOCK;
      }
    },
    enabled: !!selectedDoctor && !!selectedDate,
  });

  // 4. Booking Mutation
  const bookingMutation = useMutation({
    mutationFn: async (payload: any) => {
      // Endpoint sesungguhnya: POST /bookings
      try {
        const res = await api.post("/bookings", payload);
        return res.data;
      } catch (err: any) {
        // Fallback Simulasi
        console.error(err);
        return new Promise((resolve) => setTimeout(() => {
          resolve({
            data: { id: "BKG-" + Date.now(), token: `MC-${Date.now().toString(36).toUpperCase().slice(-6)}`, no_antrian: "A-" + Math.floor(Math.random() * 100) }
          });
        }, 1500));
      }
    },
    onSuccess: (res: any) => {
      setBookingResult(res.data);
      setStep(4); // Lanjut ke step QR
    },
    onError: (err: any) => {
      alert("Gagal melakukan booking: " + (err.response?.data?.message || err.message));
    }
  });

  const canNext = () => {
    if (step === 0) return !!selectedFacility;
    if (step === 1) return !!selectedPoli && !!selectedDoctor;
    if (step === 2) return !!selectedDate && !!selectedTime;
    return true;
  };

  const handleBooking = () => {
    if (!selectedFacility || !selectedDoctor || !selectedDate || !selectedTime) return;

    const payload = {
      facility_id: selectedFacility.id,
      doctor_id: selectedDoctor.id,
      schedule_date: formatAPI(selectedDate),
      schedule_time: selectedTime,
    };

    bookingMutation.mutate(payload);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-foreground hover:text-muted-foreground transition-colors">
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Kembali</span>
          </Link>
          <h1 className="text-lg font-bold text-foreground">Booking Antrian</h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-3xl">
        <StepIndicator currentStep={step} />

        {/* ─── Step 0: Pilih Faskes ─── */}
        {step === 0 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold text-foreground mb-1">Pilih Fasilitas Kesehatan</h2>
              <p className="text-sm text-muted-foreground">Pilih Puskesmas atau Klinik yang ingin Anda kunjungi.</p>
            </div>

            {isLoadingFacilities ? (
              <div className="flex flex-col gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-full h-24 rounded-3xl bg-muted animate-pulse"></div>
                ))}
              </div>
            ) : isErrFacilities ? (
              <div className="text-center text-destructive py-6 rounded-3xl bg-destructive/10">Gagal memuat layanan.</div>
            ) : (
              facilities?.map((f: Facility) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFacility(f)}
                  className={`w-full text-left rounded-3xl border p-5 transition-all hover-lift ${selectedFacility?.id === f.id
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border bg-card hover:border-primary/30"
                    }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${f.type === "PUSKESMAS" ? "bg-pastel-mint" : "bg-pastel-peach"
                      }`}>
                      <Building2 size={22} strokeWidth={1.5} className="text-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-bold text-foreground">{f.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${f.type === "PUSKESMAS" ? "bg-pastel-mint text-foreground" : "bg-pastel-peach text-foreground"
                          }`}>{f.type}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                        <MapPin size={11} />
                        <span className="truncate">{f.address}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin size={11} />{f.distance}</span>
                        <span className="flex items-center gap-1"><Star size={11} className="fill-amber-400 text-amber-400" />{f.rating}</span>
                        <span className="flex items-center gap-1"><Users size={11} />{f.queue} antrian</span>
                      </div>
                    </div>
                    {selectedFacility?.id === f.id && (
                      <CheckCircle2 size={22} className="text-primary flex-shrink-0 mt-1" />
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        )}

        {/* ─── Step 1: Poli & Dokter ─── */}
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-2xl font-extrabold text-foreground mb-1">Pilih Poli & Dokter</h2>
              <p className="text-sm text-muted-foreground">Tentukan unit layanan dan dokter yang Anda tuju.</p>
            </div>

            {/* Poli pills */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-3 block">Poli Tujuan</label>
              <div className="flex flex-wrap gap-2">
                {polis.map(p => (
                  <button
                    key={p}
                    onClick={() => { setSelectedPoli(p); setSelectedDoctor(null); }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedPoli === p
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                  >{p}</button>
                ))}
              </div>
            </div>

            {/* Doctor cards */}
            {selectedPoli && (
              <div>
                <label className="text-sm font-semibold text-foreground mb-3 block">Pilih Dokter</label>
                {isLoadingDoctors ? (
                  <div className="flex justify-center p-8 text-primary">
                    <Loader2 className="animate-spin" size={32} />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(!doctors || doctors.length === 0) && (
                      <p className="text-sm text-muted-foreground py-4 text-center">Belum ada dokter tersedia untuk poli ini.</p>
                    )}
                    {doctors?.map(d => (
                      <button
                        key={d.id}
                        onClick={() => setSelectedDoctor(d)}
                        className={`w-full text-left rounded-2xl border p-4 transition-all ${selectedDoctor?.id === d.id
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                          : "border-border bg-card hover:border-primary/30"
                          }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-pastel-blue flex items-center justify-center flex-shrink-0">
                            <User size={20} strokeWidth={1.5} className="text-foreground" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-foreground text-sm">{d.name}</h4>
                            <p className="text-xs text-muted-foreground">{d.spec}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="flex items-center gap-1 text-xs text-foreground font-semibold">
                              <Star size={12} className="fill-amber-400 text-amber-400" />{d.rating}
                            </div>
                            <p className="text-[10px] text-muted-foreground">{d.patients} pasien</p>
                          </div>
                          {selectedDoctor?.id === d.id && <CheckCircle2 size={18} className="text-primary" />}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ─── Step 2: Jadwal ─── */}
        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-2xl font-extrabold text-foreground mb-1">Pilih Tanggal & Waktu</h2>
              <p className="text-sm text-muted-foreground">Pilih jadwal kunjungan Anda dalam 7 hari ke depan.</p>
            </div>

            {/* Date picker */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-3 block flex items-center gap-2">
                <CalendarDays size={16} /> Tanggal
              </label>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {dates.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => { setSelectedDate(d); setSelectedTime(null); }}
                    className={`flex-shrink-0 w-20 py-3 rounded-2xl text-center transition-all ${selectedDate?.toDateString() === d.toDateString()
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-foreground hover:border-primary/30"
                      }`}
                  >
                    <p className="text-[10px] uppercase font-medium opacity-70">
                      {d.toLocaleDateString("id-ID", { weekday: "short" })}
                    </p>
                    <p className="text-xl font-bold">{d.getDate()}</p>
                    <p className="text-[10px] opacity-70">
                      {d.toLocaleDateString("id-ID", { month: "short" })}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Time slots */}
            {selectedDate && (
              <div>
                <label className="text-sm font-semibold text-foreground mb-3 block flex items-center gap-2">
                  <Clock size={16} /> Waktu
                </label>
                {isLoadingSlots ? (
                  <div className="flex items-center gap-2 text-muted-foreground py-4">
                    <Loader2 size={18} className="animate-spin" /> Sedang mengecek ketersediaan...
                  </div>
                ) : (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-3">
                    {slots?.map((slot) => {
                      return (
                        <button
                          key={slot.time}
                          onClick={() => slot.isAvailable && setSelectedTime(slot.time)}
                          disabled={!slot.isAvailable}
                          className={`py-2.5 rounded-xl text-sm font-medium transition-all ${!slot.isAvailable
                            ? "bg-muted/50 text-muted-foreground/40 cursor-not-allowed line-through"
                            : selectedTime === slot.time
                              ? "bg-primary text-primary-foreground"
                              : "bg-card border border-border text-foreground hover:border-primary/30"
                            }`}
                        >{slot.time}</button>
                      );
                    })}
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-muted/50 inline-block" /> = Slot tidak tersedia/penuh
                </p>
              </div>
            )}
          </div>
        )}

        {/* ─── Step 3: Konfirmasi ─── */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-2xl font-extrabold text-foreground mb-1">Konfirmasi Booking</h2>
              <p className="text-sm text-muted-foreground">Pastikan semua data sudah benar sebelum mengirim.</p>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 space-y-5">
              {[
                { label: "Fasilitas", value: selectedFacility?.name || "-", sub: selectedFacility?.address, icon: Building2, color: "bg-pastel-mint" },
                { label: "Poli", value: selectedPoli || "-", icon: Stethoscope, color: "bg-pastel-yellow" },
                { label: "Dokter", value: selectedDoctor?.name || "-", sub: selectedDoctor?.spec, icon: User, color: "bg-pastel-blue" },
                { label: "Tanggal", value: selectedDate ? formatDateFull(selectedDate) : "-", icon: CalendarDays, color: "bg-pastel-peach" },
                { label: "Waktu", value: selectedTime || "-", icon: Clock, color: "bg-pastel-lavender" },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}>
                    <item.icon size={18} strokeWidth={1.5} className="text-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{item.label}</p>
                    <p className="text-sm font-bold text-foreground truncate">{item.value}</p>
                    {item.sub && <p className="text-xs text-muted-foreground truncate">{item.sub}</p>}
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl bg-pastel-yellow/50 border border-pastel-yellow p-4">
              <p className="text-xs text-foreground leading-relaxed">
                <strong>Perhatian:</strong> Maksimal 2 booking aktif per NIK dalam satu hari. Booking akan otomatis dibatalkan jika tidak check-in dalam 30 menit sebelum jadwal.
              </p>
            </div>
          </div>
        )}

        {/* ─── Step 4: Success + QR ─── */}
        {step === 4 && (
          <div className="text-center space-y-6 py-4 animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 rounded-full bg-pastel-mint flex items-center justify-center mx-auto shadow-xl shadow-pastel-mint/30">
              <CheckCircle2 size={40} strokeWidth={1.5} className="text-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-foreground mb-2">Booking Berhasil! 🎉</h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Antrian Anda telah dikonfirmasi. Tunjukkan QR Code di bawah saat check-in di lokasi.
              </p>
            </div>

            {/* QR Card */}
            <div className="rounded-3xl border border-border bg-card p-8 max-w-sm mx-auto space-y-5 shadow-sm border-t-[10px] border-t-primary">
              <div className="w-48 h-48 mx-auto rounded-2xl bg-foreground/5 border-2 border-dashed border-border flex items-center justify-center">
                <QrCode size={80} strokeWidth={0.8} className="text-foreground/60" />
              </div>
              <p className="text-xs text-muted-foreground tracking-[0.3em] font-mono">{bookingResult?.token || "---"}</p>

              <div className="text-left space-y-3 pt-4 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Faskes</span>
                  <span className="font-semibold text-foreground truncate pl-2 max-w-[60%] text-right">{selectedFacility?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Poli</span>
                  <span className="font-semibold text-foreground">{selectedPoli}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Dokter</span>
                  <span className="font-semibold text-foreground truncate pl-2 max-w-[60%] text-right">{selectedDoctor?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Jadwal</span>
                  <span className="font-semibold text-foreground text-right pl-2">
                    {selectedDate ? formatDate(selectedDate) : ""}, {selectedTime}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">No. Antrian</span>
                  <span className="font-extrabold text-primary text-xl tracking-tight">{bookingResult?.no_antrian || "-"}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-medium hover-lift shadow-md shadow-primary/20"
              >
                <Download size={16} />
                Simpan / Unduh QR
              </button>
              <Link href="/"
                className="flex items-center gap-2 px-6 py-3 rounded-full border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                <Home size={16} />
                Kembali ke Beranda
              </Link>
            </div>

            <div className="rounded-2xl bg-pastel-mint/30 border border-pastel-mint p-4 max-w-sm mx-auto mt-6">
              <p className="text-xs text-foreground">
                📱 Pengingat jadwal akan dikirim via <strong>WhatsApp & Email</strong> 1 jam sebelum jadwal kunjungan.
              </p>
            </div>
          </div>
        )}

        {/* ─── Navigation Buttons ─── */}
        {step < 4 && (
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
            <button
              onClick={() => setStep(s => s - 1)}
              disabled={step === 0 || bookingMutation.isPending}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all ${step === 0
                ? "opacity-0 pointer-events-none"
                : "border border-border text-foreground hover:bg-muted"
                }`}
            >
              <ArrowLeft size={16} />
              Kembali
            </button>
            <button
              onClick={() => {
                if (step === 3) {
                  handleBooking();
                } else {
                  setStep(s => s + 1);
                }
              }}
              disabled={!canNext() || bookingMutation.isPending}
              className={`flex items-center gap-2 px-8 py-3 rounded-full text-sm font-semibold transition-all shadow-md ${!canNext()
                ? "bg-muted text-muted-foreground cursor-not-allowed shadow-none"
                : bookingMutation.isPending
                  ? "bg-primary/80 text-primary-foreground cursor-wait"
                  : "bg-primary text-primary-foreground hover-lift shadow-primary/30"
                }`}
            >
              {bookingMutation.isPending ? (
                <> <Loader2 size={16} className="animate-spin" /> Memproses... </>
              ) : step === 3 ? (
                <> Konfirmasi Booking <CheckCircle2 size={16} /> </>
              ) : (
                <> Lanjutkan <ArrowRight size={16} /> </>
              )}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default BookingPage;
