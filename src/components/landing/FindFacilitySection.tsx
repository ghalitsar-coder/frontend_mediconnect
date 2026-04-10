"use client";
import { MapPin, Search, Building2, Stethoscope, Clock, Users } from "lucide-react";
import { useState } from "react";

const facilities = [
  {
    name: "Puskesmas Menteng",
    type: "PUSKESMAS" as const,
    address: "Jl. Pegangsaan Timur No.19, Menteng, Jakarta Pusat",
    distance: "1.2 km",
    poli: ["Umum", "Gigi", "KIA"],
    rating: 4.8,
    queue: 12,
  },
  {
    name: "Klinik Sehat Sejahtera",
    type: "KLINIK" as const,
    address: "Jl. Cikini Raya No.45, Cikini, Jakarta Pusat",
    distance: "2.5 km",
    poli: ["Umum", "Anak", "Mata"],
    rating: 4.6,
    queue: 5,
  },
  {
    name: "Puskesmas Kemayoran",
    type: "KLINIK" as const,
    address: "Jl. Utan Panjang No.3, Kemayoran, Jakarta Pusat",
    distance: "3.8 km",
    poli: ["Umum", "Gigi", "Paru"],
    rating: 4.5,
    queue: 8,
  },
];

const FindFacilitySection = () => {
  const [activeFilter, setActiveFilter] = useState<"ALL" | "PUSKESMAS" | "KLINIK">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = facilities.filter((f) => {
    const matchType = activeFilter === "ALL" || f.type === activeFilter;
    const matchSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <section className="container mx-auto px-6 py-16">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <span className="inline-block px-4 py-1.5 rounded-full bg-pastel-blue text-xs font-semibold text-foreground mb-4">
            Temukan Faskes
          </span>
          <h2 className="text-3xl lg:text-5xl font-extrabold text-foreground max-w-2xl">
            Cari Puskesmas & Klinik Terdekat
          </h2>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex-1 min-w-[260px] relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari nama atau alamat faskes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-full bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="flex gap-2">
          {(["ALL", "PUSKESMAS", "KLINIK"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveFilter(t)}
              className={`px-5 py-3 rounded-full text-sm font-medium transition-all ${
                activeFilter === t
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {t === "ALL" ? "Semua" : t === "PUSKESMAS" ? "Puskesmas" : "Klinik"}
            </button>
          ))}
        </div>
      </div>

      {/* Facility Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {filtered.map((f) => (
          <div
            key={f.name}
            className="rounded-3xl bg-card border border-border p-6 hover-lift cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-pastel-blue flex items-center justify-center">
                <Building2 size={22} strokeWidth={1.5} className="text-foreground" />
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                f.type === "PUSKESMAS" ? "bg-pastel-mint text-foreground" : "bg-pastel-peach text-foreground"
              }`}>
                {f.type}
              </span>
            </div>

            <h4 className="font-bold text-foreground text-lg mb-1 group-hover:text-primary transition-colors">{f.name}</h4>
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-4">
              <MapPin size={12} />
              <span>{f.address}</span>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-5">
              {f.poli.map((p) => (
                <span key={p} className="px-2.5 py-1 rounded-full bg-muted text-[11px] font-medium text-muted-foreground">
                  {p}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin size={12} />
                  <span>{f.distance}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users size={12} />
                  <span>{f.queue} antrian</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-foreground">
                <span>⭐</span>
                <span>{f.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button className="px-8 py-3 rounded-full border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors">
          Lihat Semua Fasilitas Kesehatan
        </button>
      </div>
    </section>
  );
};

export default FindFacilitySection;
