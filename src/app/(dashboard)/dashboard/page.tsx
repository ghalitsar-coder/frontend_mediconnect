"use client";

import KpiCards from "@/components/KpiCards";
import TrendChart from "@/components/TrendChart";
import SlotChart from "@/components/SlotChart";
import QueueDonut from "@/components/QueueDonut";
import RecentPatients from "@/components/RecentPatients";

const Index = () => {
  return (
    <>
          {/* Page title */}
          <div>
            <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Ringkasan operasional Puskesmas hari ini
            </p>
          </div>

          {/* KPI Cards */}
          <KpiCards />

          {/* Charts row */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <TrendChart />
            </div>
            <SlotChart />
          </div>

          {/* Bottom row */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <QueueDonut />
            <div className="xl:col-span-2">
              <RecentPatients />
            </div>
          </div>
        </>
  );
};

export default Index;
