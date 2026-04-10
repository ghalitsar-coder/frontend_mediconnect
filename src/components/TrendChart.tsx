"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Filter, ArrowUpDown, MoreHorizontal } from "lucide-react";

const data = [
  { month: "Jul", ispa: 320, diare: 180, dbd: 90, tb: 60 },
  { month: "Agu", ispa: 280, diare: 210, dbd: 120, tb: 50 },
  { month: "Sep", ispa: 350, diare: 160, dbd: 80, tb: 70 },
  { month: "Okt", ispa: 420, diare: 240, dbd: 150, tb: 85 },
  { month: "Nov", ispa: 380, diare: 200, dbd: 110, tb: 90 },
  { month: "Des", ispa: 450, diare: 270, dbd: 170, tb: 100 },
];

const COLORS = {
  ispa: "hsl(262, 60%, 38%)",
  diare: "hsl(270, 65%, 55%)",
  dbd: "hsl(210, 80%, 60%)",
  tb: "hsl(174, 62%, 47%)",
};

const TrendChart = () => {
  const total = data.reduce(
    (sum, d) => sum + d.ispa + d.diare + d.dbd + d.tb,
    0
  );

  return (
    <div className="card-dashboard">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Tren Penyakit Harian & Booking
          </h3>
          <p className="text-kpi mt-1">{total.toLocaleString()}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors">
            <Filter className="h-3.5 w-3.5" /> Filter
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors">
            <ArrowUpDown className="h-3.5 w-3.5" /> Sort
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted transition-colors">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" vertical={false} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "hsl(220, 9%, 46%)" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "hsl(220, 9%, 46%)" }}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid hsl(220, 13%, 91%)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          />
          <Bar dataKey="ispa" stackId="a" fill={COLORS.ispa} radius={[0, 0, 0, 0]} name="ISPA" />
          <Bar dataKey="diare" stackId="a" fill={COLORS.diare} name="Diare" />
          <Bar dataKey="dbd" stackId="a" fill={COLORS.dbd} name="DBD" />
          <Bar dataKey="tb" stackId="a" fill={COLORS.tb} radius={[4, 4, 0, 0]} name="TB" />
        </BarChart>
      </ResponsiveContainer>

      <div className="flex items-center gap-5 mt-4 flex-wrap">
        {Object.entries(COLORS).map(([key, color]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
            <span className="text-xs text-muted-foreground capitalize">{key.toUpperCase()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendChart;
