import { useHealthCheck } from "@workspace/api-client-react";
import { Activity } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function TopNav() {
  const { data: health } = useHealthCheck();

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-card/50 px-4">
      <SidebarTrigger className="-ml-1" />
      <div className="flex-1" />
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2 text-primary">
          <Activity className="w-4 h-4" />
          <span className="capitalize">{health?.status || "Connecting..."}</span>
        </div>
      </div>
    </header>
  );
}
