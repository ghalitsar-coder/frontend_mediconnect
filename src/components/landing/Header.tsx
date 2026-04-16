// Server Component — tidak ada "use client"
// Baca cookie di server, tidak ada useEffect atau useState
import { Search, ShoppingCart, MapPin, ChevronDown, User, LogOut } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";  // ← hanya mutasi (logout)
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCurrentUser } from "@/lib/auth";
import { LogoutButton } from "../LogoutButton";

const Header = async () => {
  // Dibaca di SERVER — tidak ada flash/loading state, tidak ada POST request
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-full bg-pastel-mint flex items-center justify-center">
            <span className="text-navy font-bold text-sm">M</span>
          </div>
          <Link href="/" className="text-xl font-bold text-foreground">MediCare</Link>
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

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors">
                  <User size={16} />
                  My Account
                  <ChevronDown size={14} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>
                  <span className="text-xs text-muted-foreground">Logged in as</span>
                  <p className="font-medium capitalize">{user.role.toLowerCase()}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* PATIENT tidak ditampilkan link Dashboard */}
                {user.role !== "PATIENT" && (
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                {user.role === "PATIENT" && (
                  <DropdownMenuItem asChild>
                    <Link href="/booking-saya" className="cursor-pointer">
                      Jadwal Saya
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    Profile Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <LogoutButton/>
                  </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/login"
              className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Loginasd
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
