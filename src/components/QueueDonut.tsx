"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Confirmed", value: 580, color: "hsl(262, 60%, 38%)" },
  { name: "Pending", value: 230, color: "hsl(270, 65%, 55%)" },
  { name: "Cancelled", value: 90, color: "hsl(174, 62%, 47%)" },
];

const QueueDonut = () => {
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="card-dashboard">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-foreground">
          Distribusi Status Antrian
        </h3>
        <select className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30">
          <option>Monthly</option>
          <option>Weekly</option>
        </select>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {data.map((d) => (
          <div key={d.name} className="text-center">
            <p className="text-lg font-bold text-foreground">{d.value}</p>
            <p className="text-xs text-muted-foreground">{d.name}</p>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="90%"
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {data.map((d, i) => (
              <Cell key={i} fill={d.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className="flex justify-center gap-4 mt-2">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
            <span className="text-xs text-muted-foreground">{d.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QueueDonut;
