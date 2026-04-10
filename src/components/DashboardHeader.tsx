import { Search, Gift, Bell, Plus, ChevronDown } from "lucide-react";

const DashboardHeader = () => {
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
        <button className="flex items-center gap-2 rounded-lg px-3 py-1.5 hover:bg-muted transition-colors">
          <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-purple text-primary-foreground text-xs font-bold">
            AD
          </div>
          <span className="text-sm font-medium text-foreground">Admin Dinkes</span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
