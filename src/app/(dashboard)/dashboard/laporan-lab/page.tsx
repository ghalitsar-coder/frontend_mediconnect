"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FlaskConical, Search, MoreHorizontal, Download, CheckCircle, Clock, AlertTriangle } from "lucide-react";

const labData = [
  { id: "LAB-20260401", pasien: "Siti Aminah", jenis: "Darah Lengkap", tanggal: "10 Apr 2026", status: "Selesai", hasil: "Normal", statusColor: "bg-emerald-100 text-emerald-700" },
  { id: "LAB-20260402", pasien: "Budi Santoso", jenis: "Gula Darah", tanggal: "10 Apr 2026", status: "Selesai", hasil: "Tinggi", statusColor: "bg-rose-100 text-rose-700" },
  { id: "LAB-20260403", pasien: "Rina Wati", jenis: "Urine Lengkap", tanggal: "10 Apr 2026", status: "Proses", hasil: "-", statusColor: "bg-amber-100 text-amber-700" },
  { id: "LAB-20260404", pasien: "Ahmad Yusuf", jenis: "Kolesterol", tanggal: "09 Apr 2026", status: "Selesai", hasil: "Normal", statusColor: "bg-emerald-100 text-emerald-700" },
  { id: "LAB-20260405", pasien: "Dewi Lestari", jenis: "HbA1c", tanggal: "09 Apr 2026", status: "Selesai", hasil: "Normal", statusColor: "bg-emerald-100 text-emerald-700" },
  { id: "LAB-20260406", pasien: "Joko Widodo", jenis: "Darah Lengkap", tanggal: "09 Apr 2026", status: "Proses", hasil: "-", statusColor: "bg-amber-100 text-amber-700" },
  { id: "LAB-20260407", pasien: "Mega Sari", jenis: "Widal", tanggal: "08 Apr 2026", status: "Selesai", hasil: "Positif", statusColor: "bg-rose-100 text-rose-700" },
  { id: "LAB-20260408", pasien: "Hendra Gunawan", jenis: "Gula Darah", tanggal: "08 Apr 2026", status: "Selesai", hasil: "Normal", statusColor: "bg-emerald-100 text-emerald-700" },
];

const stats = [
  { label: "Total Pemeriksaan (Apr)", value: "342", icon: FlaskConical },
  { label: "Selesai", value: "298", icon: CheckCircle },
  { label: "Dalam Proses", value: "44", icon: Clock },
  { label: "Hasil Abnormal", value: "27", icon: AlertTriangle },
];

const LaporanLab = () => {
  return (
    <>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-xl font-bold text-foreground">Laporan Laboratorium</h1>
              <p className="text-sm text-muted-foreground">Hasil pemeriksaan dan monitoring laboratorium</p>
            </div>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" /> Export CSV
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {stats.map((s) => (
              <Card key={s.label} className="shadow-card">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">{s.label}</span>
                    <s.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-2xl font-extrabold text-foreground">{s.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Cari nama pasien atau No. Lab..." className="pl-10" />
          </div>

          {/* Table */}
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">Daftar Pemeriksaan Lab</CardTitle>
              <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-muted-foreground">
                      <th className="pb-3 font-medium">No. Lab</th>
                      <th className="pb-3 font-medium">Pasien</th>
                      <th className="pb-3 font-medium">Jenis Pemeriksaan</th>
                      <th className="pb-3 font-medium">Tanggal</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Hasil</th>
                    </tr>
                  </thead>
                  <tbody>
                    {labData.map((row) => (
                      <tr key={row.id} className="border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer transition-colors">
                        <td className="py-3 font-semibold text-primary">{row.id}</td>
                        <td className="py-3 text-foreground">{row.pasien}</td>
                        <td className="py-3 text-muted-foreground">{row.jenis}</td>
                        <td className="py-3 text-muted-foreground">{row.tanggal}</td>
                        <td className="py-3">
                          <Badge variant="secondary" className={`text-xs ${row.status === "Selesai" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                            {row.status}
                          </Badge>
                        </td>
                        <td className="py-3">
                          <Badge variant="secondary" className={`text-xs ${row.statusColor}`}>
                            {row.hasil}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
  );
};

export default LaporanLab;
