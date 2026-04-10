"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Clock, CheckCircle, AlertCircle, MoreHorizontal } from "lucide-react";

const queueData = [
  { id: "A-001", nama: "Siti Aminah", poli: "Poli Umum", waktu: "08:15", status: "Dilayani", statusColor: "bg-emerald-100 text-emerald-700" },
  { id: "A-002", nama: "Budi Santoso", poli: "Poli Gigi", waktu: "08:22", status: "Menunggu", statusColor: "bg-amber-100 text-amber-700" },
  { id: "A-003", nama: "Rina Wati", poli: "Poli KIA", waktu: "08:30", status: "Menunggu", statusColor: "bg-amber-100 text-amber-700" },
  { id: "A-004", nama: "Ahmad Yusuf", poli: "Poli Umum", waktu: "08:35", status: "Menunggu", statusColor: "bg-amber-100 text-amber-700" },
  { id: "A-005", nama: "Dewi Lestari", poli: "Poli Umum", waktu: "08:40", status: "Terdaftar", statusColor: "bg-blue-100 text-blue-700" },
  { id: "A-006", nama: "Joko Widodo", poli: "Poli Gigi", waktu: "08:45", status: "Terdaftar", statusColor: "bg-blue-100 text-blue-700" },
  { id: "A-007", nama: "Mega Sari", poli: "Poli KIA", waktu: "08:50", status: "Selesai", statusColor: "bg-muted text-muted-foreground" },
  { id: "A-008", nama: "Hendra Gunawan", poli: "Poli Umum", waktu: "07:55", status: "Selesai", statusColor: "bg-muted text-muted-foreground" },
];

const stats = [
  { label: "Total Antrian Hari Ini", value: "48", icon: Users, change: "+12%", up: true },
  { label: "Sedang Dilayani", value: "3", icon: CheckCircle, change: "", up: true },
  { label: "Menunggu", value: "8", icon: Clock, change: "-5%", up: false },
  { label: "Batal / Tidak Hadir", value: "2", icon: AlertCircle, change: "+1", up: true },
];

const AntrianPasien = () => {
  return (
    <>
          <div>
            <h1 className="text-xl font-bold text-foreground">Antrian Pasien</h1>
            <p className="text-sm text-muted-foreground">Manajemen dan monitoring antrian pasien real-time</p>
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
                  {s.change && (
                    <span className={`text-xs font-medium ${s.up ? "text-emerald-600" : "text-rose-500"}`}>
                      {s.change}
                    </span>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Queue Table */}
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">Daftar Antrian</CardTitle>
              <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-muted-foreground">
                      <th className="pb-3 font-medium">No. Antrian</th>
                      <th className="pb-3 font-medium">Nama Pasien</th>
                      <th className="pb-3 font-medium">Poli Tujuan</th>
                      <th className="pb-3 font-medium">Waktu Daftar</th>
                      <th className="pb-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {queueData.map((row) => (
                      <tr key={row.id} className="border-b border-border last:border-0">
                        <td className="py-3 font-semibold text-foreground">{row.id}</td>
                        <td className="py-3 text-foreground">{row.nama}</td>
                        <td className="py-3 text-muted-foreground">{row.poli}</td>
                        <td className="py-3 text-muted-foreground">{row.waktu}</td>
                        <td className="py-3">
                          <Badge variant="secondary" className={`${row.statusColor} text-xs`}>
                            {row.status}
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

export default AntrianPasien;
