import { useHealthCheck } from "@workspace/api-client-react";
import { Activity, Globe, Rocket } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Link, useLocation } from "wouter";

export function TopNav() {
  const { data: health } = useHealthCheck();
  const [location] = useLocation();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/70 bg-[#070d18]/90 backdrop-blur-md px-3 sm:px-4 z-30">
      
      {/* Left section: Hamburger Trigger & Mobile Brand */}
      <div className="flex items-center gap-2 sm:gap-3">
        <SidebarTrigger className="min-h-[44px] min-w-[44px] flex items-center justify-center -ml-1 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors" />
        
        {/* Mobile Logo (visible only on mobile) */}
        <Link href="/" className="md:hidden flex items-center gap-1.5 hover:opacity-85 transition-opacity py-1">
          <Rocket className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-sm tracking-tight text-slate-100">OIP</span>
        </Link>
      </div>

      {/* Right section: Quick action + Live Connection Status */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick link to 3D Globe on desktop or tablet if not currently on that page */}
        {location !== "/live-orbital-view" && (
          <Link
            href="/live-orbital-view"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60 hover:text-cyan-200 text-xs font-mono transition-colors min-h-[36px]"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>3D Earth</span>
          </Link>
        )}

        {/* Live Status indicator */}
        <div className="flex items-center gap-1.5 text-xs font-mono bg-slate-900/80 border border-slate-800/80 px-2.5 py-1 rounded-full text-slate-300 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="hidden xs:inline text-[11px] text-slate-400">STATUS:</span>
          <span className="text-emerald-400 font-semibold text-[11px] capitalize truncate max-w-[80px] sm:max-w-none">
            {health?.status || "Online"}
          </span>
        </div>
      </div>
    </header>
  );
}
