"use client";
import { Search, ShoppingCart, MapPin, ChevronDown } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-full bg-pastel-mint flex items-center justify-center">
            <span className="text-navy font-bold text-sm">M</span>
          </div>
          <span className="text-xl font-bold text-foreground">MediCare</span>
        </div>

        {/* Location */}
        <button className="hidden md:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <MapPin size={16} />
          <span>Select Location</span>
          <ChevronDown size={14} />
        </button>

        {/* Search */}
        <div className="hidden lg:flex flex-1 max-w-md relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Medicine and healthcare items"
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-muted border-none text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/10"
          />
        </div>

        {/* Nav Items */}
        <nav className="hidden md:flex items-center gap-5">
          <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            Healthcare Services
            <span className="px-2 py-0.5 rounded-full bg-pastel-peach text-xs font-semibold text-foreground">New</span>
          </button>
          <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">Offer</button>
          <button className="relative text-muted-foreground hover:text-foreground transition-colors">
            <ShoppingCart size={20} />
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-pastel-peach text-[10px] font-bold flex items-center justify-center text-foreground">2</span>
          </button>
          <button className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            Login
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
