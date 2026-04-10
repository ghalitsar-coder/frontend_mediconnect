import { CalendarCheck, Clock, AlertTriangle, Wifi } from "lucide-react";

const kpis = [
  {
    icon: CalendarCheck,
    label: "Total Booking Antrian",
    value: "12,450",
    badge: "+15.8%",
    up: true,
  },
  {
    icon: Clock,
    label: "Rata-rata Waktu Tunggu",
    value: "12 Menit",
    badge: "-3.2%",
    up: false,
  },
  {
    icon: AlertTriangle,
    label: "Peringatan Surveilans",
    value: "24 Kasus",
    badge: "+21.4%",
    up: true,
  },
  {
    icon: Wifi,
    label: "API Uptime",
    value: "99.5%",
    badge: "+0.3%",
    up: true,
  },
];

const KpiCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <div key={kpi.label} className="card-dashboard flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
              <kpi.icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <span className={kpi.up ? "badge-up" : "badge-down"}>
              {kpi.up ? "↗" : "↘"} {kpi.badge}
            </span>
          </div>
          <div>
            <p className="text-label">{kpi.label}</p>
            <p className="text-kpi mt-1">{kpi.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KpiCards;
