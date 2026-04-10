"use client";
import { FlaskConical, Bell, Smartphone, CheckCircle, Clock, ArrowRight } from "lucide-react";

const labTests = [
  {
    name: "Hematologi Lengkap",
    status: "ready" as const,
    date: "28 Feb 2026",
    results: [
      { param: "Hemoglobin", value: "14.2 g/dL", range: "13.0 - 17.5", normal: true },
      { param: "Leukosit", value: "11.800 /µL", range: "4.000 - 10.000", normal: false },
      { param: "Trombosit", value: "250.000 /µL", range: "150.000 - 400.000", normal: true },
    ],
  },
  {
    name: "Gula Darah Puasa",
    status: "ready" as const,
    date: "28 Feb 2026",
    results: [
      { param: "Glukosa", value: "95 mg/dL", range: "70 - 100", normal: true },
    ],
  },
  {
    name: "Profil Lipid",
    status: "processing" as const,
    date: "28 Feb 2026",
    results: [],
  },
];

const LabResultsSection = () => {
  return (
    <section className="container mx-auto px-6 py-16">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left - Mock Lab Results */}
        <div className="space-y-4 order-2 lg:order-1">
          {labTests.map((test) => (
            <div
              key={test.name}
              className="rounded-3xl bg-card border border-border p-6 hover-lift cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pastel-lavender flex items-center justify-center">
                    <FlaskConical size={18} strokeWidth={1.5} className="text-foreground" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm">{test.name}</h4>
                    <p className="text-xs text-muted-foreground">{test.date}</p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    test.status === "ready"
                      ? "bg-pastel-mint text-foreground"
                      : "bg-pastel-yellow text-foreground"
                  }`}
                >
                  {test.status === "ready" ? "Selesai" : "Diproses"}
                </span>
              </div>

              {test.results.length > 0 && (
                <div className="space-y-2">
                  {test.results.map((r) => (
                    <div key={r.param} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <span className="text-xs text-muted-foreground w-28">{r.param}</span>
                      <span className={`text-sm font-semibold ${r.normal ? "text-foreground" : "text-destructive"}`}>
                        {r.value}
                      </span>
                      <span className="text-[11px] text-muted-foreground hidden sm:block">{r.range}</span>
                      {r.normal ? (
                        <CheckCircle size={14} className="text-pastel-mint ml-2" />
                      ) : (
                        <span className="text-[10px] font-bold text-destructive ml-2">↑ Tinggi</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {test.status === "processing" && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                  <Clock size={12} className="animate-pulse" />
                  <span>Hasil akan tersedia dalam 1-2 jam</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right - Info */}
        <div className="order-1 lg:order-2">
          <span className="inline-block px-4 py-1.5 rounded-full bg-pastel-lavender text-xs font-semibold text-foreground mb-4">
            Hasil Lab Online
          </span>
          <h2 className="text-3xl lg:text-5xl font-extrabold text-foreground mb-4 leading-tight">
            Cek Hasil Lab Langsung dari Smartphone
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-lg">
            Tidak perlu datang ke faskes hanya untuk mengambil hasil. Begitu lab selesai, Anda langsung mendapat notifikasi dan bisa cek hasilnya secara digital.
          </p>

          <div className="space-y-4 mb-8">
            {[
              { icon: Bell, text: "Notifikasi otomatis via WhatsApp & email saat hasil siap" },
              { icon: Smartphone, text: "Akses hasil lab kapan saja dari genggaman Anda" },
              { icon: FlaskConical, text: "Data lab terenkripsi AES-256, aman dan terlindungi" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-pastel-lavender/50 flex items-center justify-center flex-shrink-0">
                  <item.icon size={16} strokeWidth={1.5} className="text-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>

          <button className="group flex items-center gap-3 px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold hover-lift">
            Lihat Hasil Lab Saya
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default LabResultsSection;
