import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { TopNav } from "./TopNav";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col h-[100dvh] overflow-hidden relative" style={{ background: "#070d18" }}>
        {/* Subtle space background */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Faint star dots via CSS */}
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(1px 1px at 10% 15%, rgba(255,255,255,0.35) 0%, transparent 100%),
              radial-gradient(1px 1px at 25% 45%, rgba(255,255,255,0.25) 0%, transparent 100%),
              radial-gradient(1.5px 1.5px at 40% 8%, rgba(255,255,255,0.4) 0%, transparent 100%),
              radial-gradient(1px 1px at 55% 60%, rgba(255,255,255,0.2) 0%, transparent 100%),
              radial-gradient(1px 1px at 70% 30%, rgba(255,255,255,0.3) 0%, transparent 100%),
              radial-gradient(1.5px 1.5px at 82% 75%, rgba(255,255,255,0.35) 0%, transparent 100%),
              radial-gradient(1px 1px at 93% 20%, rgba(255,255,255,0.25) 0%, transparent 100%),
              radial-gradient(1px 1px at 15% 80%, rgba(255,255,255,0.2) 0%, transparent 100%),
              radial-gradient(1px 1px at 35% 90%, rgba(255,255,255,0.15) 0%, transparent 100%),
              radial-gradient(1.5px 1.5px at 60% 50%, rgba(200,230,255,0.2) 0%, transparent 100%),
              radial-gradient(1px 1px at 78% 10%, rgba(255,255,255,0.3) 0%, transparent 100%),
              radial-gradient(1px 1px at 90% 55%, rgba(255,255,255,0.2) 0%, transparent 100%),
              radial-gradient(1px 1px at 5% 40%, rgba(255,255,255,0.25) 0%, transparent 100%),
              radial-gradient(1px 1px at 48% 70%, rgba(200,220,255,0.2) 0%, transparent 100%),
              radial-gradient(1.5px 1.5px at 20% 25%, rgba(255,255,255,0.3) 0%, transparent 100%)
            `
          }} />
          {/* Deep space nebula glow */}
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-[0.04]"
            style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)" }} />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-[0.03]"
            style={{ background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)" }} />
          {/* Subtle grid */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px"
          }} />
        </div>

        <TopNav />
        <main className="flex-1 overflow-auto p-4 md:p-6 relative z-10">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
