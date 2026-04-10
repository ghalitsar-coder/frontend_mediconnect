"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from "recharts";

const data = [
  { day: "Mon", slots: 45 },
  { day: "Tue", slots: 72 },
  { day: "Wed", slots: 58 },
  { day: "Thu", slots: 40 },
  { day: "Fri", slots: 55 },
  { day: "Sat", slots: 30 },
];

const SlotChart = () => {
  return (
    <div className="card-dashboard">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-semibold text-foreground">
          Ketersediaan Slot Puskesmas
        </h3>
        <select className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30">
          <option>Weekly</option>
          <option>Monthly</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barCategoryGap="30%">
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "hsl(220, 9%, 46%)" }}
          />
          <YAxis hide />
          <Bar dataKey="slots" radius={[6, 6, 0, 0]}>
            {data.map((_, idx) => (
              <Cell
                key={idx}
                fill={idx === 1 ? "url(#purpleGrad)" : "hsl(220, 14%, 92%)"}
              />
            ))}
          </Bar>
          <defs>
            <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(262, 60%, 38%)" />
              <stop offset="100%" stopColor="hsl(270, 65%, 55%)" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SlotChart;
