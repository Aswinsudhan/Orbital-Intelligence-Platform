import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Satellite, 
  Globe, 
  Trash2, 
  Menu
} from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

export function MobileBottomNav() {
  const [location] = useLocation();
  const { setOpenMobile } = useSidebar();

  const isLiveActive = location === "/live-orbital-view";
  const isDashboardActive = location === "/dashboard";
  const isSatellitesActive = location === "/satellites" || location.startsWith("/satellites/");
  const isDebrisActive = location === "/debris";

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070d18]/95 backdrop-blur-xl border-t border-slate-800/80 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] pb-[env(safe-area-inset-bottom,0px)]"
    >
      <div className="flex items-center justify-around h-16 px-1">
        
        {/* Dashboard */}
        <Link 
          href="/dashboard"
          className={`flex flex-col items-center justify-center flex-1 h-full min-h-[44px] transition-colors ${
            isDashboardActive ? "text-cyan-400 font-semibold" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <div className="relative">
            <LayoutDashboard className="w-5 h-5" />
            {isDashboardActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_6px_#00f0ff]" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1">Dashboard</span>
        </Link>

        {/* Satellites */}
        <Link 
          href="/satellites"
          className={`flex flex-col items-center justify-center flex-1 h-full min-h-[44px] transition-colors ${
            isSatellitesActive ? "text-cyan-400 font-semibold" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <div className="relative">
            <Satellite className="w-5 h-5" />
            {isSatellitesActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_6px_#00f0ff]" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1">Catalog</span>
        </Link>

        {/* 3D Live Orbital View (Center Highlighted Button) */}
        <Link 
          href="/live-orbital-view"
          className="flex flex-col items-center justify-center flex-1 h-full min-h-[44px] -mt-3 group"
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
            isLiveActive 
              ? "bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-[0_0_18px_rgba(6,182,212,0.6)] scale-105" 
              : "bg-slate-900 border border-cyan-500/40 text-cyan-400 group-hover:border-cyan-400"
          }`}>
            <Globe className={`w-6 h-6 ${isLiveActive ? "animate-spin-slow" : ""}`} />
          </div>
          <span className={`text-[10px] tracking-tight mt-0.5 font-bold ${
            isLiveActive ? "text-cyan-300" : "text-slate-300"
          }`}>
            3D Earth
          </span>
        </Link>

        {/* Debris */}
        <Link 
          href="/debris"
          className={`flex flex-col items-center justify-center flex-1 h-full min-h-[44px] transition-colors ${
            isDebrisActive ? "text-cyan-400 font-semibold" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <div className="relative">
            <Trash2 className="w-5 h-5" />
            {isDebrisActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_6px_#00f0ff]" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1">Debris</span>
        </Link>

        {/* Mobile Menu (Open Sidebar Sheet) */}
        <button 
          type="button"
          onClick={() => setOpenMobile(true)}
          className="flex flex-col items-center justify-center flex-1 h-full min-h-[44px] text-slate-400 hover:text-slate-200 transition-colors"
          aria-label="Open full mission control menu"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">More</span>
        </button>

      </div>
    </nav>
  );
}
