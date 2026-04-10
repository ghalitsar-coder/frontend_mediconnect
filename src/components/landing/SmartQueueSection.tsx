"use client";
import { QrCode, CalendarCheck, Clock, MapPin, ArrowRight, CheckCircle2, Smartphone, ScanLine } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Smartphone,
    title: "Daftar Online",
    desc: "Buat akun dengan NIK dan verifikasi identitas melalui API Dukcapil.",
    color: "bg-pastel-yellow",
  },
  {
    step: "02",
    icon: MapPin,
    title: "Pilih Faskes & Poli",
    desc: "Pilih Puskesmas/Klinik terdekat, poli tujuan, dan dokter yang tersedia.",
    color: "bg-pastel-mint",
  },
  {
    step: "03",
    icon: CalendarCheck,
    title: "Booking Antrian",
    desc: "Pilih jadwal dan dapatkan nomor antrian. Maks 2 booking aktif per hari.",
    color: "bg-pastel-blue",
  },
  {
    step: "04",
    icon: ScanLine,
    title: "QR Check-in",
    desc: "Scan QR Code unik di lokasi untuk check-in. Auto-cancel jika 30 menit tidak hadir.",
    color: "bg-pastel-peach",
  },
];

const SmartQueueSection = () => {
  return (
    <section className="container mx-auto px-6 py-16">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left - Info */}
        <div>
          <span className="inline-block px-4 py-1.5 rounded-full bg-pastel-mint text-xs font-semibold text-foreground mb-4">
            Antrian Smart
          </span>
          <h2 className="text-3xl lg:text-5xl font-extrabold text-foreground mb-4 leading-tight">
            Booking Antrian Online, Tanpa Antre Fisik
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-lg">
            Daftar antrian Puskesmas dari rumah, dapatkan QR Code, dan langsung check-in di lokasi. Cepat, mudah, dan transparan.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-card border border-border">
              <Clock size={20} className="text-muted-foreground" />
              <div>
                <p className="text-lg font-bold text-foreground">&lt; 50ms</p>
                <p className="text-xs text-muted-foreground">Cek slot real-time</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-card border border-border">
              <QrCode size={20} className="text-muted-foreground" />
              <div>
                <p className="text-lg font-bold text-foreground">QR Unik</p>
                <p className="text-xs text-muted-foreground">Per kunjungan</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-card border border-border">
              <CheckCircle2 size={20} className="text-muted-foreground" />
              <div>
                <p className="text-lg font-bold text-foreground">Auto-cancel</p>
                <p className="text-xs text-muted-foreground">30 menit timeout</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Steps */}
        <div className="space-y-4">
          {steps.map((s, i) => (
            <div
              key={s.step}
              className="flex items-start gap-5 p-5 rounded-3xl bg-card border border-border hover-lift cursor-pointer group"
            >
              <div className={`w-14 h-14 rounded-2xl ${s.color} flex items-center justify-center flex-shrink-0`}>
                <s.icon size={24} strokeWidth={1.5} className="text-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Step {s.step}</span>
                </div>
                <h4 className="font-bold text-foreground text-lg mb-1">{s.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
              <ArrowRight size={18} className="text-muted-foreground mt-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SmartQueueSection;
