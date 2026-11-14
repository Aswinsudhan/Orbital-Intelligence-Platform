import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Rocket,
  LayoutDashboard,
  Satellite,
  Globe,
  Trash2,
  LineChart,
  TrendingUp,
  AlertTriangle,
  ShieldAlert,
  Settings,
  Info,
  Flame,
  X
} from "lucide-react";

export function AppSidebar() {
  const [location] = useLocation();
  const { isMobile, setOpenMobile } = useSidebar();

  const navItems = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Satellites", url: "/satellites", icon: Satellite },
    { title: "Live Orbital View", url: "/live-orbital-view", icon: Globe, highlight: true },
    { title: "Debris", url: "/debris", icon: Trash2 },
    { title: "Analytics", url: "/analytics", icon: LineChart },
    { title: "Forecast", url: "/analytics/forecast", icon: TrendingUp },
    { title: "Risk Engine", url: "/risk", icon: ShieldAlert },
    { title: "Collisions", url: "/collisions", icon: AlertTriangle },
    { title: "Launches", url: "/launches", icon: Flame },
    { title: "Admin", url: "/admin", icon: Settings },
    { title: "About", url: "/about", icon: Info },
  ];

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar variant="inset" className="border-r border-border bg-[#070d18] text-slate-100">
      <SidebarHeader className="border-b border-border/80 py-3.5 px-4 flex flex-row items-center justify-between">
        <Link 
          href="/" 
          onClick={handleNavClick}
          className="flex items-center gap-2.5 hover:opacity-85 transition-opacity min-h-[44px]"
        >
          <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shadow-[0_0_12px_rgba(6,182,212,0.3)]">
            <Rocket className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight leading-none text-slate-100">OIP</span>
            <span className="text-[10px] text-cyan-400/80 font-mono tracking-wider uppercase mt-0.5">Orbital Intelligence</span>
          </div>
        </Link>

        {/* Mobile Close Button */}
        {isMobile && (
          <button
            type="button"
            onClick={() => setOpenMobile(false)}
            className="md:hidden text-slate-400 hover:text-slate-100 p-2 rounded-lg hover:bg-slate-800/60 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </SidebarHeader>

      <SidebarContent className="px-2 py-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-mono uppercase tracking-wider text-slate-400/80 px-2 py-2">
            Mission Control
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navItems.map((item) => {
                const isActive = location === item.url || (item.url !== "/" && location.startsWith(item.url));
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      className="min-h-[44px] px-3 rounded-lg text-sm transition-all"
                    >
                      <Link 
                        href={item.url} 
                        onClick={handleNavClick}
                        className={`flex items-center gap-3 w-full ${
                          isActive 
                            ? "font-semibold text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.15)]" 
                            : "text-slate-300 hover:text-slate-100 hover:bg-slate-800/40"
                        }`}
                      >
                        <item.icon className={`w-4 h-4 shrink-0 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                        <span className="flex-1 truncate">{item.title}</span>
                        {item.highlight && (
                          <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-cyan-900/60 border border-cyan-500/40 text-cyan-300">
                            3D
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
