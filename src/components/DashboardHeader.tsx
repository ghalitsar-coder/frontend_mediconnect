"use client";

import { Search, Gift, Bell, Plus, ChevronDown, User, Settings, LogOut, Shield } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutAction } from "@/app/actions/auth";
import { api, clearAuthSessionMarkers } from "@/lib/api-client";
import { useRouter } from "next/navigation";

// Baca cookie non-HttpOnly di client
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

const ROLE_LABEL: Record<string, string> = {
  DINKES: "Admin Dinkes",
  NAKES: "Tenaga Kesehatan",
  PATIENT: "Pasien",
};

const ROLE_INITIALS: Record<string, string> = {
  DINKES: "DK",
  NAKES: "NK",
  PATIENT: "PS",
};

const DashboardHeader = () => {
  const [role, setRole] = useState<string>("DINKES");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const r = getCookie("user_role");
    if (r) setRole(r);
  }, []);

  const router  = useRouter()
 
   const handleLogout = async () => {
     try {
       // Panggil API logout backend (credentials: 'include' otomatis)
       await api.auth.logout();
     } catch (error) {
       console.error("Logout API error:", error);
     } finally {
       // Hapus penanda session di client (localStorage / non-HttpOnly cookie)
       clearAuthSessionMarkers();
       
       // Redirect ke halaman utama dan refresh data client
       router.push("/");
       router.refresh();
     }
   };

  const label = ROLE_LABEL[role] ?? role;
  const initials = ROLE_INITIALS[role] ?? role.slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-6">
      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Cari pasien, antrian, atau laporan..."
          className="h-10 w-full rounded-lg border border-border bg-secondary pl-10 pr-16 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          ⌘F
        </kbd>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 ml-4">
        <button className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted transition-colors">
          <Gift className="h-[18px] w-[18px]" />
        </button>
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted transition-colors">
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
        </button>
        <button className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted transition-colors">
          <Plus className="h-[18px] w-[18px]" />
        </button>
        <div className="ml-2 h-8 w-px bg-border" />

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              id="user-menu-trigger"
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 hover:bg-muted transition-colors focus:outline-none"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-purple text-primary-foreground text-xs font-bold">
                {initials}
              </div>
              <span className="text-sm font-medium text-foreground">{label}</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold text-foreground">{label}</span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Shield className="h-3 w-3" />
                {role}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <User className="h-4 w-4" />
                Profil Saya
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="h-4 w-4" />
                Pengaturan
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              disabled={isPending}
              onSelect={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              {isPending ? "Keluar..." : "Keluar"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;

