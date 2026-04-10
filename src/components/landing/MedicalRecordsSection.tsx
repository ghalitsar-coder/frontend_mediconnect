"use client";
import { ShieldCheck, FileText, Eye, History, Lock, ClipboardList } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Rekam Medis per Kunjungan",
    desc: "Setiap kunjungan tercatat lengkap dengan diagnosis, catatan dokter, dan kode ICD-10.",
    color: "bg-pastel-lavender",
  },
  {
    icon: Lock,
    title: "Enkripsi AES-256",
    desc: "Diagnosis dan catatan medis dienkripsi end-to-end. Data Anda aman dan terlindungi.",
    color: "bg-pastel-peach",
  },
  {
    icon: Eye,
    title: "Akses Read-Only untuk Pasien",
    desc: "Lihat riwayat medis Anda kapan saja, di mana saja melalui smartphone.",
    color: "bg-pastel-blue",
  },
  {
    icon: History,
    title: "Audit Trail Lengkap",
    desc: "Setiap perubahan rekam medis dicatat: siapa, kapan, dan apa yang diubah.",
    color: "bg-pastel-mint",
  },
];

const MedicalRecordsSection = () => {
  return (
    <section className="bg-navy text-primary-foreground">
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-pastel-mint/20 text-xs font-semibold text-pastel-mint mb-4">
            Rekam Medis Digital
          </span>
          <h2 className="text-3xl lg:text-5xl font-extrabold mb-4 max-w-3xl mx-auto leading-tight">
            Riwayat Kesehatan Anda, Aman & Selalu Tersedia
          </h2>
          <p className="text-primary-foreground/60 text-lg max-w-xl mx-auto">
            Rekam medis digital terpusat dengan enkripsi tingkat militer. Akses riwayat periksa kapan saja dari genggaman Anda.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-3xl bg-navy-light/50 border border-primary-foreground/10 p-6 hover-lift cursor-pointer group"
            >
              <div className={`w-12 h-12 rounded-2xl ${f.color} flex items-center justify-center mb-5`}>
                <f.icon size={22} strokeWidth={1.5} className="text-foreground" />
              </div>
              <h4 className="font-bold text-primary-foreground text-lg mb-2">{f.title}</h4>
              <p className="text-sm text-primary-foreground/60 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Mock EMR Preview Card */}
        <div className="mt-12 rounded-3xl bg-navy-light/30 border border-primary-foreground/10 p-8 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-pastel-mint flex items-center justify-center">
              <ClipboardList size={18} className="text-foreground" />
            </div>
            <div>
              <p className="font-bold text-primary-foreground text-sm">Rekam Medis — Kunjungan Terakhir</p>
              <p className="text-xs text-primary-foreground/50">28 Februari 2026 · Puskesmas Menteng</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full bg-pastel-mint/20">
              <ShieldCheck size={12} className="text-pastel-mint" />
              <span className="text-[10px] font-semibold text-pastel-mint">Terenkripsi</span>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { label: "Diagnosis", value: "J06.9 — Infeksi Saluran Pernapasan Atas", locked: true },
              { label: "Dokter", value: "dr. Sanjana Gupta, Sp.PD", locked: false },
              { label: "Tindakan", value: "Pemeriksaan fisik, resep obat", locked: false },
              { label: "Catatan", value: "Kontrol ulang 7 hari jika tidak membaik", locked: true },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-primary-foreground/5 last:border-0">
                <span className="text-xs text-primary-foreground/50 uppercase tracking-wider w-24">{item.label}</span>
                <span className="text-sm text-primary-foreground flex-1 ml-4">{item.value}</span>
                {item.locked && <Lock size={12} className="text-primary-foreground/30 ml-2" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MedicalRecordsSection;
