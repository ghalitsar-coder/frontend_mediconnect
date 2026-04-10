"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp, Activity, ShieldAlert } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const trendData = [
  { bulan: "Jan", ISPA: 120, Diare: 85, DBD: 12, TB: 8 },
  { bulan: "Feb", ISPA: 135, Diare: 72, DBD: 18, TB: 10 },
  { bulan: "Mar", ISPA: 98, Diare: 90, DBD: 25, TB: 7 },
  { bulan: "Apr", ISPA: 145, Diare: 68, DBD: 30, TB: 12 },
];

const alerts = [
  { penyakit: "Demam Berdarah (DBD)", wilayah: "Kec. Cikutra", level: "Kritis", kasus: 30, trend: "+66%", icon: ShieldAlert },
  { penyakit: "ISPA", wilayah: "Kec. Coblong", level: "Waspada", kasus: 145, trend: "+48%", icon: AlertTriangle },
  { penyakit: "Diare", wilayah: "Kec. Lengkong", level: "Normal", kasus: 68, trend: "-24%", icon: Activity },
  { penyakit: "Tuberkulosis (TB)", wilayah: "Kec. Cikutra", level: "Waspada", kasus: 12, trend: "+71%", icon: TrendingUp },
];

const levelColor: Record<string, string> = {
  Kritis: "bg-rose-100 text-rose-700",
  Waspada: "bg-amber-100 text-amber-700",
  Normal: "bg-emerald-100 text-emerald-700",
};

const SurveilansPenyakit = () => {
  return (
    <>
          <div>
            <h1 className="text-xl font-bold text-foreground">Surveilans Penyakit</h1>
            <p className="text-sm text-muted-foreground">Pemantauan dan pelaporan kasus penyakit menular & tidak menular</p>
          </div>

          {/* Alert Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {alerts.map((a) => (
              <Card key={a.penyakit} className="shadow-card">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary" className={`text-xs ${levelColor[a.level]}`}>{a.level}</Badge>
                    <a.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-semibold text-foreground mb-1">{a.penyakit}</p>
                  <p className="text-xs text-muted-foreground mb-2">{a.wilayah}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-foreground">{a.kasus}</span>
                    <span className="text-xs text-muted-foreground">kasus</span>
                    <span className={`text-xs font-medium ml-auto ${a.trend.startsWith("+") ? "text-rose-500" : "text-emerald-600"}`}>
                      {a.trend}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Chart */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Tren Kasus per Bulan (2026)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendData} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="bulan" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Bar dataKey="ISPA" fill="hsl(262, 60%, 38%)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Diare" fill="hsl(262, 50%, 55%)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="DBD" fill="hsl(200, 70%, 55%)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="TB" fill="hsl(174, 62%, 47%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </>
  );
};

export default SurveilansPenyakit;
