import { Link, useLocation } from "wouter";
import { playClick } from "@/lib/sounds";
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
} from "@/components/ui/sidebar";
import {
  Rocket,
  LayoutDashboard,
  Satellite,
  Trash2,
  LineChart,
  TrendingUp,
  AlertTriangle,
  ShieldAlert,
  Settings,
  Info,
  Flame
} from "lucide-react";

export function AppSidebar() {
  const [location] = useLocation();

  const navItems = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Satellites", url: "/satellites", icon: Satellite },
    { title: "Debris", url: "/debris", icon: Trash2 },
    { title: "Analytics", url: "/analytics", icon: LineChart },
    { title: "Forecast", url: "/analytics/forecast", icon: TrendingUp },
    { title: "Risk Engine", url: "/risk", icon: ShieldAlert },
    { title: "Collisions", url: "/collisions", icon: AlertTriangle },
    { title: "Launches", url: "/launches", icon: Flame },
    { title: "Admin", url: "/admin", icon: Settings },
    { title: "About", url: "/about", icon: Info },
  ];

  return (
    <Sidebar variant="inset" className="border-r border-border">
      <SidebarHeader className="border-b border-border py-4">
        <Link href="/" className="flex items-center gap-2 px-2 hover:opacity-80 transition-opacity">
          <Rocket className="w-6 h-6 text-primary" />
          <span className="font-bold text-lg tracking-tight">OIP</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Mission Control</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url || (item.url !== "/" && location.startsWith(item.url))}>
                    <Link href={item.url} className="flex items-center gap-3" onClick={() => playClick()}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
