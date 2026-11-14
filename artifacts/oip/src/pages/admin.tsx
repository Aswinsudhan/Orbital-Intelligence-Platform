import { useState, useEffect, useRef } from "react";
import { useGetAdminStatus, getGetAdminStatusQueryKey, useTriggerRefresh, useGetLastUpdate } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Database, RefreshCw, Server, Activity, Clock,
  CheckCircle2, XCircle, Play, Square, Timer, Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const INTERVAL_OPTIONS = [
  { label: "15 min", value: 15 },
  { label: "30 min", value: 30 },
  { label: "1 hour",  value: 60 },
  { label: "2 hours", value: 120 },
  { label: "6 hours", value: 360 },
  { label: "12 hours", value: 720 },
  { label: "24 hours", value: 1440 },
];

function useCountdown(targetIso: string | null) {
  const [remaining, setRemaining] = useState("");
  useEffect(() => {
    if (!targetIso) { setRemaining(""); return; }
    const tick = () => {
      const diff = new Date(targetIso).getTime() - Date.now();
      if (diff <= 0) { setRemaining("Now"); return; }
      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1000);
      setRemaining(
        h > 0
          ? `${h}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`
          : `${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetIso]);
  return remaining;
}

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedInterval, setSelectedInterval] = useState(30);

  const { data: status, isLoading: isLoadingStatus, refetch: refetchStatus } =
    useGetAdminStatus({ query: { queryKey: getGetAdminStatusQueryKey(), refetchInterval: 5000 } });
  const { data: lastUpdate, isLoading: isLoadingUpdate, refetch: refetchLastUpdate } =
    useGetLastUpdate({ query: { refetchInterval: 5000, queryKey: ["last-update"] } });

  const countdown = useCountdown((status as any)?.nextRefresh ?? null);

  const refreshMutation = useTriggerRefresh({
    mutation: {
      onSuccess: (data) => {
        toast({ title: "Sync Started", description: data.message });
        queryClient.invalidateQueries({ queryKey: getGetAdminStatusQueryKey() });
        setTimeout(() => { refetchStatus(); refetchLastUpdate(); }, 3000);
      },
      onError: (error: any) => {
        const errorMsg =
          error?.data?.error ||
          error?.data?.message ||
          error?.message ||
          "An unknown error occurred during sync.";
        toast({
          title: "Refresh Failed",
          description: errorMsg,
          variant: "destructive"
        });
      }
    }
  });

  const [schedulerPending, setSchedulerPending] = useState(false);

  const getBaseApiUrl = () => (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "") || "";

  const enableScheduler = async () => {
    setSchedulerPending(true);
    try {
      const baseUrl = getBaseApiUrl();
      const res = await fetch(`${baseUrl}/api/admin/scheduler/enable`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intervalMinutes: selectedInterval }),
      });
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("text/html")) {
        throw new Error("Received HTML response instead of JSON. Ensure VITE_API_URL environment variable is set or proxy redirect rule is active.");
      }
      const rawText = await res.text();
      let data: any = {};
      if (rawText.trim()) {
        try {
          data = JSON.parse(rawText);
        } catch {
          throw new Error(`Invalid response format from server: ${rawText.slice(0, 100)}`);
        }
      }
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      toast({ title: "Auto-Sync Enabled", description: data.message || "Auto sync schedule updated." });
      refetchStatus();
    } catch (e: any) {
      toast({ title: "Auto-Sync Error", description: e.message, variant: "destructive" });
    } finally {
      setSchedulerPending(false);
    }
  };

  const disableScheduler = async () => {
    setSchedulerPending(true);
    try {
      const baseUrl = getBaseApiUrl();
      const res = await fetch(`${baseUrl}/api/admin/scheduler/disable`, { method: "POST" });
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("text/html")) {
        throw new Error("Received HTML response instead of JSON. Ensure VITE_API_URL environment variable is set or proxy redirect rule is active.");
      }
      const rawText = await res.text();
      let data: any = {};
      if (rawText.trim()) {
        try {
          data = JSON.parse(rawText);
        } catch {
          throw new Error(`Invalid response format from server: ${rawText.slice(0, 100)}`);
        }
      }
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      toast({ title: "Auto-Sync Disabled", description: data.message || "Auto sync stopped." });
      refetchStatus();
    } catch (e: any) {
      toast({ title: "Auto-Sync Error", description: e.message, variant: "destructive" });
    } finally {
      setSchedulerPending(false);
    }
  };

  const isLoading = isLoadingStatus || isLoadingUpdate;
  const schedulerRunning = (status as any)?.schedulerRunning ?? false;
  const isRefreshing = (status as any)?.isRefreshing ?? false;
  const currentInterval = (status as any)?.schedulerIntervalMinutes ?? selectedInterval;

  return (
    <div className="space-y-6 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">System Administration</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            CelesTrak telemetry ingestion and periodic background scheduler
          </p>
        </div>
        <Button
          onClick={() => refreshMutation.mutate(undefined as any)}
          disabled={refreshMutation.isPending || isRefreshing}
          className="gap-2 shadow-lg shadow-primary/20 min-h-[44px] w-full sm:w-auto px-6"
        >
          <RefreshCw className={`w-4 h-4 ${refreshMutation.isPending || isRefreshing ? "animate-spin" : ""}`} />
          {refreshMutation.isPending || isRefreshing ? "Syncing…" : "Sync Data Now"}
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <Skeleton className="h-[200px] w-full rounded-xl" />
          <Skeleton className="h-[200px] w-full rounded-xl" />
          <Skeleton className="h-[280px] w-full rounded-xl md:col-span-2" />
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">

          {/* ── Auto-Sync Scheduler ─────────────────────────── */}
          <Card className="md:col-span-2 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Timer className="w-5 h-5 text-primary" />
                Auto-Sync Scheduler
              </CardTitle>
              <CardDescription className="text-xs">
                Configure periodic telemetry updates from CelesTrak GP orbital elements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">

                {/* Status indicator */}
                <div className="flex items-center gap-3 min-w-[180px]">
                  <div className={`w-3.5 h-3.5 rounded-full transition-all ${schedulerRunning ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" : "bg-zinc-500"}`} />
                  <div>
                    <div className="font-semibold text-sm">
                      {schedulerRunning ? "Auto-Sync Active" : "Auto-Sync Stopped"}
                    </div>
                    {schedulerRunning && countdown ? (
                      <div className="text-xs text-muted-foreground font-mono">
                        Next sync: <span className="text-cyan-400 font-bold">{countdown}</span>
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground">Scheduler is inactive</div>
                    )}
                  </div>
                </div>

                {/* Interval picker with touch targets >= 44px */}
                <div className="flex flex-col gap-1.5 flex-1 w-full">
                  <label className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Sync Interval</label>
                  <div className="flex flex-wrap gap-2">
                    {INTERVAL_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setSelectedInterval(opt.value)}
                        className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium border transition-all min-h-[44px] ${
                          selectedInterval === opt.value
                            ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/30 font-semibold"
                            : "bg-muted/30 text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {schedulerRunning && (
                    <p className="text-xs text-muted-foreground mt-1 font-mono">
                      Active: every <span className="text-foreground font-medium">{INTERVAL_OPTIONS.find(o => o.value === currentInterval)?.label ?? `${currentInterval} min`}</span>.
                    </p>
                  )}
                </div>

                {/* Enable / Disable button */}
                <div className="w-full lg:w-auto pt-2 lg:pt-0">
                  {schedulerRunning ? (
                    <Button
                      variant="destructive"
                      onClick={disableScheduler}
                      disabled={schedulerPending}
                      className="gap-2 min-h-[44px] w-full lg:w-[150px]"
                    >
                      <Square className="w-4 h-4" />
                      {schedulerPending ? "Stopping…" : "Stop Auto-Sync"}
                    </Button>
                  ) : (
                    <Button
                      onClick={enableScheduler}
                      disabled={schedulerPending}
                      className="gap-2 min-h-[44px] w-full lg:w-[150px] bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/30"
                    >
                      <Play className="w-4 h-4" />
                      {schedulerPending ? "Starting…" : "Start Auto-Sync"}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── API Health ──────────────────────────────────── */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Activity className="w-5 h-5 text-primary" />
                API & Backend Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between py-2.5 border-b border-border/50 text-sm">
                <span className="text-muted-foreground">Core Service</span>
                <Badge variant={(status as any)?.apiHealth === "ok" ? "default" : "destructive"} className="uppercase gap-1">
                  {(status as any)?.apiHealth === "ok"
                    ? <><CheckCircle2 className="w-3 h-3" /> OK</>
                    : <><XCircle className="w-3 h-3" /> Error</>
                  }
                </Badge>
              </div>
              <div className="flex items-center justify-between py-2.5 border-b border-border/50 text-sm">
                <span className="text-muted-foreground">Sync In Progress</span>
                <Badge variant={isRefreshing ? "default" : "secondary"} className="uppercase">
                  {isRefreshing ? "Running" : "Idle"}
                </Badge>
              </div>
              <div className="flex items-center justify-between py-2.5 text-sm">
                <span className="text-muted-foreground">Last Ingestion</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {(status as any)?.lastRefresh
                    ? new Date((status as any).lastRefresh).toLocaleString()
                    : "Never"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* ── Local Datastore ─────────────────────────────── */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Database className="w-5 h-5 text-primary" />
                Orbital Database
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
                {[
                  { label: "Satellites",    value: lastUpdate?.satelliteCount ?? 0, color: "text-cyan-400" },
                  { label: "Debris",        value: lastUpdate?.debrisCount ?? 0,    color: "text-orange-400" },
                  { label: "Rocket Bodies", value: lastUpdate?.rocketBodyCount ?? 0, color: "text-pink-400" },
                  {
                    label: "Total Records",
                    value: ((lastUpdate?.satelliteCount ?? 0) + (lastUpdate?.debrisCount ?? 0) + (lastUpdate?.rocketBodyCount ?? 0)),
                    color: "text-foreground",
                  },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-muted/30 p-3 sm:p-4 rounded-xl border border-border/50">
                    <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">{label}</div>
                    <div className={`text-xl sm:text-2xl font-bold font-mono ${color}`}>{value.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* ── Data Sources ────────────────────────────────── */}
          <Card className="md:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Server className="w-5 h-5 text-primary" />
                Upstream CelesTrak Ingestion
              </CardTitle>
              <CardDescription className="text-xs">Live connectivity to upstream TLE providers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2.5">
                {Object.entries((status as any)?.dataSourceStatus ?? {}).map(([source, src]) => (
                  <div key={source} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-muted/20 border border-border rounded-xl gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-2 h-2 rounded-full ${src === "connected" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" : "bg-red-500"}`} />
                      <span className="font-semibold font-mono text-xs sm:text-sm">{source}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <Badge variant="outline" className={src === "connected" ? "text-emerald-400 border-emerald-500/30" : "text-red-400 border-red-500/30"}>
                        {String(src)}
                      </Badge>
                      <span className="font-mono text-[11px]">
                        Last Sync: {(status as any)?.lastRefresh ? new Date((status as any).lastRefresh).toLocaleTimeString() : "Never"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      )}
    </div>
  );
}
