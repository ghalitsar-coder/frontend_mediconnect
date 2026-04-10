"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  Shield,
  Map,
  FlaskConical,
  Activity,
  ChevronDown,
} from "lucide-react";

const mainNav = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Users, label: "Antrian Pasien", path: "/dashboard/antrian", badge: 8 },
  { icon: FileText, label: "Rekam Medis (EMR)", path: "/dashboard/rekam-medis" },
  { icon: Shield, label: "Surveilans Penyakit", path: "/dashboard/surveilans" },
];

const systemNav = [
  { icon: Map, label: "Peta Heatmap", path: "/dashboard/peta-heatmap" },
  { icon: FlaskConical, label: "Laporan Lab", path: "/dashboard/laporan-lab" },
  { icon: Activity, label: "Kinerja Sistem", path: "/dashboard/kinerja-sistem" },
];

const DashboardSidebar = ({ activeMenu }: { activeMenu?: string }) => {
  const pathname = usePathname();

  const isActive = (item: { label: string; path: string }) => {
    if (activeMenu) return item.label === activeMenu;
    return pathname === item.path;
  };

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-border">
        <img src="/mediconnect-logo.png" alt="MediConnect ID" width={32} height={32} />
        <span className="text-lg font-bold text-foreground">MediConnect</span>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <p className="text-label px-3 mb-2 text-xs uppercase tracking-wider">Menu Utama</p>
        {mainNav.map((item) => (
          <Link
            key={item.label}
            href={item.path}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive(item)
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <item.icon className="h-[18px] w-[18px]" />
            <span className="flex-1">{item.label}</span>
            {item.badge && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {item.badge}
              </span>
            )}
          </Link>
        ))}

        <div className="pt-4" />
        <p className="text-label px-3 mb-2 text-xs uppercase tracking-wider">Sistem & Analitik</p>
        {systemNav.map((item) => (
          <Link
            key={item.label}
            href={item.path}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <item.icon className="h-[18px] w-[18px]" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* User Profile */}
      <div className="border-t border-border p-4">
        <button className="flex w-full items-center gap-3 rounded-lg px-2 py-2 hover:bg-muted transition-colors">
          <div className="flex h-9 w-9 items-center justify-center rounded-full gradient-purple text-primary-foreground text-xs font-bold">
            PK
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold text-foreground">Puskesmas Kota</p>
            <p className="text-xs text-muted-foreground">Admin Operator</p>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
