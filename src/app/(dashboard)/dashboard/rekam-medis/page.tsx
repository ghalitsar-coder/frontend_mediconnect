"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Search, MoreHorizontal } from "lucide-react";

const patients = [
  { id: "RM-20250001", nama: "Siti Aminah", nik: "3201****0001", umur: "34 thn", gender: "P", lastVisit: "10 Apr 2026", diagnosa: "ISPA (J06.9)", status: "Aktif" },
  { id: "RM-20250002", nama: "Budi Santoso", nik: "3201****0045", umur: "45 thn", gender: "L", lastVisit: "09 Apr 2026", diagnosa: "Hipertensi (I10)", status: "Aktif" },
  { id: "RM-20250003", nama: "Rina Wati", nik: "3201****0102", umur: "28 thn", gender: "P", lastVisit: "08 Apr 2026", diagnosa: "Kehamilan (Z34.0)", status: "Aktif" },
  { id: "RM-20250004", nama: "Ahmad Yusuf", nik: "3201****0078", umur: "52 thn", gender: "L", lastVisit: "07 Apr 2026", diagnosa: "Diabetes (E11.9)", status: "Aktif" },
  { id: "RM-20250005", nama: "Dewi Lestari", nik: "3201****0200", umur: "19 thn", gender: "P", lastVisit: "05 Apr 2026", diagnosa: "Gastritis (K29.7)", status: "Aktif" },
  { id: "RM-20250006", nama: "Hendra Gunawan", nik: "3201****0155", umur: "61 thn", gender: "L", lastVisit: "01 Apr 2026", diagnosa: "Asma (J45.9)", status: "Tidak Aktif" },
];

const RekamMedis = () => {
  return (
    <>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">Rekam Medis Elektronik</h1>
              <p className="text-sm text-muted-foreground">Kelola data rekam medis pasien</p>
            </div>
            <Button className="gradient-purple text-primary-foreground">
              <FileText className="h-4 w-4 mr-2" /> Tambah Rekam Medis
            </Button>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Cari nama pasien atau No. RM..." className="pl-10" />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="shadow-card">
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground mb-1">Total Rekam Medis</p>
                <p className="text-2xl font-extrabold text-foreground">8,432</p>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground mb-1">Kunjungan Bulan Ini</p>
                <p className="text-2xl font-extrabold text-foreground">1,204</p>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground mb-1">Pasien Baru (Apr)</p>
                <p className="text-2xl font-extrabold text-foreground">87</p>
              </CardContent>
            </Card>
          </div>

          {/* Table */}
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">Daftar Pasien</CardTitle>
              <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-muted-foreground">
                      <th className="pb-3 font-medium">No. RM</th>
                      <th className="pb-3 font-medium">Nama</th>
                      <th className="pb-3 font-medium">Umur / JK</th>
                      <th className="pb-3 font-medium">Kunjungan Terakhir</th>
                      <th className="pb-3 font-medium">Diagnosa Terakhir</th>
                      <th className="pb-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map((p) => (
                      <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer transition-colors">
                        <td className="py-3 font-semibold text-primary">{p.id}</td>
                        <td className="py-3 text-foreground">{p.nama}</td>
                        <td className="py-3 text-muted-foreground">{p.umur} / {p.gender}</td>
                        <td className="py-3 text-muted-foreground">{p.lastVisit}</td>
                        <td className="py-3 text-foreground">{p.diagnosa}</td>
                        <td className="py-3">
                          <Badge variant="secondary" className={`text-xs ${p.status === "Aktif" ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}>
                            {p.status}
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

export default RekamMedis;
