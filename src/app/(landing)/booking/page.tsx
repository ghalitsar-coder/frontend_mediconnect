"use client";
import { useState } from "react";
import { ArrowLeft, ArrowRight, MapPin, Building2, Stethoscope, CalendarDays, Clock, CheckCircle2, QrCode, User, ChevronRight, Star, Users, Download, Home } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ── Data ──
const facilities = [
  { id: "f1", name: "Puskesmas Menteng", type: "PUSKESMAS", address: "Jl. Pegangsaan Timur No.19, Jakarta Pusat", distance: "1.2 km", rating: 4.8, queue: 12 },
  { id: "f2", name: "Klinik Sehat Sejahtera", type: "KLINIK", address: "Jl. Cikini Raya No.45, Jakarta Pusat", distance: "2.5 km", rating: 4.6, queue: 5 },
  { id: "f3", name: "Puskesmas Kemayoran", type: "PUSKESMAS", address: "Jl. Utan Panjang No.3, Jakarta Pusat", distance: "3.8 km", rating: 4.5, queue: 8 },
];

const polis = ["Poli Umum", "Poli Gigi", "Poli KIA", "Poli Anak", "Poli Mata", "Poli Paru"];

const doctors = [
  { id: "d1", name: "dr. Sanjana Gupta", spec: "Dokter Umum", poli: "Poli Umum", rating: 4.9, patients: 1240 },
  { id: "d2", name: "dr. Ahmad Fadli", spec: "Dokter Umum", poli: "Poli Umum", rating: 4.7, patients: 980 },
  { id: "d3", name: "drg. Maria Lestari", spec: "Dokter Gigi", poli: "Poli Gigi", rating: 4.8, patients: 856 },
  { id: "d4", name: "dr. Rina Wulandari, Sp.A", spec: "Dokter Anak", poli: "Poli Anak", rating: 4.9, patients: 1102 },
  { id: "d5", name: "dr. Budi Santoso, Sp.M", spec: "Dokter Mata", poli: "Poli Mata", rating: 4.6, patients: 743 },
];

const timeSlots = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "13:00", "13:30", "14:00", "14:30"];

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

// ── Step Indicator ──
const StepIndicator = ({ currentStep }: { currentStep: number }) => {
  const steps = ["Pilih Faskes", "Poli & Dokter", "Jadwal", "Konfirmasi", "Selesai"];
  return (
    <div className="flex items-center justify-center gap-1 mb-10">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-1">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            i < currentStep ? "bg-pastel-mint text-foreground" :
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
  const [selectedFacility, setSelectedFacility] = useState<string | null>(null);
  const [selectedPoli, setSelectedPoli] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const dates = generateDates();
  const facility = facilities.find(f => f.id === selectedFacility);
  const doctor = doctors.find(d => d.id === selectedDoctor);
  const filteredDoctors = doctors.filter(d => !selectedPoli || d.poli === selectedPoli);

  const canNext = () => {
    if (step === 0) return !!selectedFacility;
    if (step === 1) return !!selectedPoli && !!selectedDoctor;
    if (step === 2) return !!selectedDate && !!selectedTime;
    return true;
  };

  const qrToken = `MC-${Date.now().toString(36).toUpperCase().slice(-6)}`;

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
          <div className="space-y-4">
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold text-foreground mb-1">Pilih Fasilitas Kesehatan</h2>
              <p className="text-sm text-muted-foreground">Pilih Puskesmas atau Klinik yang ingin Anda kunjungi.</p>
            </div>
            {facilities.map(f => (
              <button
                key={f.id}
                onClick={() => setSelectedFacility(f.id)}
                className={`w-full text-left rounded-3xl border p-5 transition-all hover-lift ${
                  selectedFacility === f.id
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border bg-card hover:border-primary/30"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    f.type === "PUSKESMAS" ? "bg-pastel-mint" : "bg-pastel-peach"
                  }`}>
                    <Building2 size={22} strokeWidth={1.5} className="text-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-bold text-foreground">{f.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        f.type === "PUSKESMAS" ? "bg-pastel-mint text-foreground" : "bg-pastel-peach text-foreground"
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
                  {selectedFacility === f.id && (
                    <CheckCircle2 size={22} className="text-primary flex-shrink-0 mt-1" />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* ─── Step 1: Poli & Dokter ─── */}
        {step === 1 && (
          <div className="space-y-8">
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
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedPoli === p
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
                <div className="space-y-3">
                  {filteredDoctors.length === 0 && (
                    <p className="text-sm text-muted-foreground py-4 text-center">Belum ada dokter tersedia untuk poli ini.</p>
                  )}
                  {filteredDoctors.map(d => (
                    <button
                      key={d.id}
                      onClick={() => setSelectedDoctor(d.id)}
                      className={`w-full text-left rounded-2xl border p-4 transition-all ${
                        selectedDoctor === d.id
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
                        {selectedDoctor === d.id && <CheckCircle2 size={18} className="text-primary" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── Step 2: Jadwal ─── */}
        {step === 2 && (
          <div className="space-y-8">
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
                    onClick={() => setSelectedDate(d)}
                    className={`flex-shrink-0 w-20 py-3 rounded-2xl text-center transition-all ${
                      selectedDate?.toDateString() === d.toDateString()
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
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {timeSlots.map(t => {
                    const unavailable = ["09:30", "11:00", "14:00"].includes(t);
                    return (
                      <button
                        key={t}
                        onClick={() => !unavailable && setSelectedTime(t)}
                        disabled={unavailable}
                        className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                          unavailable
                            ? "bg-muted/50 text-muted-foreground/40 cursor-not-allowed line-through"
                            : selectedTime === t
                              ? "bg-primary text-primary-foreground"
                              : "bg-card border border-border text-foreground hover:border-primary/30"
                        }`}
                      >{t}</button>
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-muted/50 inline-block" /> = Slot tidak tersedia
                </p>
              </div>
            )}
          </div>
        )}

        {/* ─── Step 3: Konfirmasi ─── */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-foreground mb-1">Konfirmasi Booking</h2>
              <p className="text-sm text-muted-foreground">Pastikan semua data sudah benar sebelum mengirim.</p>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 space-y-5">
              {[
                { label: "Fasilitas", value: facility?.name || "-", sub: facility?.address, icon: Building2, color: "bg-pastel-mint" },
                { label: "Poli", value: selectedPoli || "-", icon: Stethoscope, color: "bg-pastel-yellow" },
                { label: "Dokter", value: doctor?.name || "-", sub: doctor?.spec, icon: User, color: "bg-pastel-blue" },
                { label: "Tanggal", value: selectedDate ? formatDateFull(selectedDate) : "-", icon: CalendarDays, color: "bg-pastel-peach" },
                { label: "Waktu", value: selectedTime || "-", icon: Clock, color: "bg-pastel-lavender" },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}>
                    <item.icon size={18} strokeWidth={1.5} className="text-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{item.label}</p>
                    <p className="text-sm font-bold text-foreground">{item.value}</p>
                    {item.sub && <p className="text-xs text-muted-foreground">{item.sub}</p>}
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl bg-pastel-yellow/50 border border-pastel-yellow p-4">
              <p className="text-xs text-foreground leading-relaxed">
                <strong>Perhatian:</strong> Maksimal 2 booking aktif per NIK dalam satu hari. Booking akan otomatis dibatalkan jika tidak check-in dalam 30 menit setelah jadwal.
              </p>
            </div>
          </div>
        )}

        {/* ─── Step 4: Success + QR ─── */}
        {step === 4 && (
          <div className="text-center space-y-6 py-4">
            <div className="w-20 h-20 rounded-full bg-pastel-mint flex items-center justify-center mx-auto">
              <CheckCircle2 size={40} strokeWidth={1.5} className="text-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-foreground mb-2">Booking Berhasil! 🎉</h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Antrian Anda telah dikonfirmasi. Tunjukkan QR Code di bawah saat check-in di lokasi.
              </p>
            </div>

            {/* QR Card */}
            <div className="rounded-3xl border border-border bg-card p-8 max-w-sm mx-auto space-y-5">
              <div className="w-48 h-48 mx-auto rounded-2xl bg-foreground/5 border-2 border-dashed border-border flex items-center justify-center">
                <QrCode size={80} strokeWidth={0.8} className="text-foreground/60" />
              </div>
              <p className="text-xs text-muted-foreground tracking-[0.3em] font-mono">{qrToken}</p>

              <div className="text-left space-y-3 pt-4 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Faskes</span>
                  <span className="font-semibold text-foreground">{facility?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Poli</span>
                  <span className="font-semibold text-foreground">{selectedPoli}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Dokter</span>
                  <span className="font-semibold text-foreground">{doctor?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Jadwal</span>
                  <span className="font-semibold text-foreground">
                    {selectedDate ? formatDate(selectedDate) : ""}, {selectedTime}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">No. Antrian</span>
                  <span className="font-extrabold text-foreground text-lg">A-013</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-medium hover-lift">
                <Download size={16} />
                Simpan QR Code
              </button>
              <Link href="/"
                className="flex items-center gap-2 px-6 py-3 rounded-full border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                <Home size={16} />
                Kembali ke Beranda
              </Link>
            </div>

            <div className="rounded-2xl bg-pastel-mint/30 border border-pastel-mint p-4 max-w-sm mx-auto">
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
              disabled={step === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all ${
                step === 0
                  ? "opacity-0 pointer-events-none"
                  : "border border-border text-foreground hover:bg-muted"
              }`}
            >
              <ArrowLeft size={16} />
              Kembali
            </button>
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canNext()}
              className={`flex items-center gap-2 px-8 py-3 rounded-full text-sm font-semibold transition-all hover-lift ${
                canNext()
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              {step === 3 ? "Konfirmasi Booking" : "Lanjutkan"}
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default BookingPage;
