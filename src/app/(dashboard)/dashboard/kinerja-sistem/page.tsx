"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Server, Wifi, Database, Clock, CheckCircle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const uptimeData = [
  { jam: "00:00", uptime: 99.9 },
  { jam: "04:00", uptime: 99.8 },
  { jam: "08:00", uptime: 99.5 },
  { jam: "10:00", uptime: 98.2 },
  { jam: "12:00", uptime: 99.7 },
  { jam: "14:00", uptime: 99.9 },
  { jam: "16:00", uptime: 99.6 },
  { jam: "18:00", uptime: 99.8 },
  { jam: "20:00", uptime: 99.9 },
  { jam: "22:00", uptime: 100 },
];

const responseData = [
  { endpoint: "Auth API", avg: 120, p99: 350 },
  { endpoint: "EMR API", avg: 180, p99: 520 },
  { endpoint: "Antrian API", avg: 95, p99: 280 },
  { endpoint: "Lab API", avg: 150, p99: 400 },
  { endpoint: "Surveilans", avg: 210, p99: 600 },
];

const services = [
  { name: "API Gateway", status: "Online", uptime: "99.95%", icon: Server },
  { name: "Database PostgreSQL", status: "Online", uptime: "99.99%", icon: Database },
  { name: "Auth Service", status: "Online", uptime: "99.90%", icon: CheckCircle },
  { name: "Queue Service", status: "Degraded", uptime: "98.20%", icon: Clock },
  { name: "WebSocket (Real-time)", status: "Online", uptime: "99.85%", icon: Wifi },
];

const statusColor: Record<string, string> = {
  Online: "bg-emerald-100 text-emerald-700",
  Degraded: "bg-amber-100 text-amber-700",
  Offline: "bg-rose-100 text-rose-700",
};

const stats = [
  { label: "API Uptime (24h)", value: "99.5%", icon: Activity, color: "text-emerald-600" },
  { label: "Avg Response Time", value: "142ms", icon: Clock, color: "text-primary" },
  { label: "Total Requests (24h)", value: "48.2K", icon: Server, color: "text-accent" },
  { label: "Error Rate", value: "0.12%", icon: Wifi, color: "text-emerald-600" },
];

const KinerjaSistem = () => {
  return (
    <>
          <div>
            <h1 className="text-xl font-bold text-foreground">Kinerja Sistem</h1>
            <p className="text-sm text-muted-foreground">Monitoring uptime, response time, dan status layanan</p>
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
                  <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Uptime Chart */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Uptime Hari Ini (%)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={uptimeData}>
                      <defs>
                        <linearGradient id="uptimeGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(262, 60%, 38%)" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="hsl(262, 60%, 38%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="jam" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                      <YAxis domain={[97, 100]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                      <Area type="monotone" dataKey="uptime" stroke="hsl(262, 60%, 38%)" fill="url(#uptimeGrad)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Response Time */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Response Time per Endpoint (ms)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={responseData} layout="vertical" barGap={2}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                      <YAxis dataKey="endpoint" type="category" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={100} />
                      <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                      <Bar dataKey="avg" name="Avg" fill="hsl(262, 60%, 38%)" radius={[0, 4, 4, 0]} barSize={14} />
                      <Bar dataKey="p99" name="P99" fill="hsl(174, 62%, 47%)" radius={[0, 4, 4, 0]} barSize={14} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Services Status */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Status Layanan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {services.map((svc) => (
                  <div key={svc.name} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <svc.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">{svc.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-muted-foreground">Uptime: {svc.uptime}</span>
                      <Badge variant="secondary" className={`text-xs ${statusColor[svc.status]}`}>
                        {svc.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
  );
};

export default KinerjaSistem;
