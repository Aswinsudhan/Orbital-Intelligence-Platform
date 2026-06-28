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
  { label: "15 minutes", value: 15 },
  { label: "30 minutes", value: 30 },
  { label: "1 hour",    value: 60 },
  { label: "2 hours",   value: 120 },
  { label: "6 hours",   value: 360 },
  { label: "12 hours",  value: 720 },
  { label: "24 hours",  value: 1440 },
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
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
        toast({ title: "Sync Failed", description: error?.response?.data?.error || "Unknown error", variant: "destructive" });
      },
    },
  });

  const [schedulerPending, setSchedulerPending] = useState(false);

  const enableScheduler = async () => {
    setSchedulerPending(true);
    try {
      const res = await fetch("/api/admin/scheduler/enable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intervalMinutes: selectedInterval }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast({ title: "Auto-Sync Enabled", description: data.message });
      refetchStatus();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setSchedulerPending(false);
    }
  };

  const disableScheduler = async () => {
    setSchedulerPending(true);
    try {
      const res = await fetch("/api/admin/scheduler/disable", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast({ title: "Auto-Sync Disabled", description: data.message });
      refetchStatus();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setSchedulerPending(false);
    }
  };

  const isLoading = isLoadingStatus || isLoadingUpdate;
  const schedulerRunning = (status as any)?.schedulerRunning ?? false;
  const isRefreshing = (status as any)?.isRefreshing ?? false;
  const currentInterval = (status as any)?.schedulerIntervalMinutes ?? selectedInterval;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Administration</h1>
          <p className="text-muted-foreground mt-1">
            Control data sync — manually or automatically on your schedule
          </p>
        </div>
        <Button
          onClick={() => refreshMutation.mutate(undefined as any)}
          disabled={refreshMutation.isPending || isRefreshing}
          size="lg"
          className="gap-2 shadow-lg shadow-primary/20 min-w-[160px]"
        >
          <RefreshCw className={`w-4 h-4 ${refreshMutation.isPending || isRefreshing ? "animate-spin" : ""}`} />
          {refreshMutation.isPending || isRefreshing ? "Syncing…" : "Sync Data Now"}
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[200px] w-full rounded-xl" />
          <Skeleton className="h-[200px] w-full rounded-xl" />
          <Skeleton className="h-[280px] w-full rounded-xl md:col-span-2" />
          <Skeleton className="h-[220px] w-full rounded-xl md:col-span-2" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">

          {/* ── Auto-Sync Scheduler ─────────────────────────── */}
          <Card className="md:col-span-2 border-primary/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Timer className="w-5 h-5 text-primary" />
                Auto-Sync Scheduler
              </CardTitle>
              <CardDescription>
                Turn on automatic sync and choose how often data is refreshed from CelesTrak
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">

                {/* Status indicator */}
                <div className="flex items-center gap-3 min-w-[180px]">
                  <div className={`w-3 h-3 rounded-full transition-all ${schedulerRunning ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]" : "bg-zinc-500"}`} />
                  <div>
                    <div className="font-semibold text-sm">
                      {schedulerRunning ? "Auto-Sync Active" : "Auto-Sync Off"}
                    </div>
                    {schedulerRunning && countdown ? (
                      <div className="text-xs text-muted-foreground font-mono">
                        Next sync in: <span className="text-primary font-bold">{countdown}</span>
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground">Scheduler is stopped</div>
                    )}
                  </div>
                </div>

                {/* Interval picker */}
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Sync Interval</label>
                  <div className="flex flex-wrap gap-2">
                    {INTERVAL_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setSelectedInterval(opt.value)}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-all ${
                          selectedInterval === opt.value
                            ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/30"
                            : "bg-muted/30 text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {schedulerRunning && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Currently running every <span className="text-foreground font-medium">{INTERVAL_OPTIONS.find(o => o.value === currentInterval)?.label ?? `${currentInterval} min`}</span>.
                      Select a new interval and click Enable to change it.
                    </p>
                  )}
                </div>

                {/* Enable / Disable buttons */}
                <div className="flex gap-3 shrink-0">
                  {schedulerRunning ? (
                    <Button
                      variant="destructive"
                      onClick={disableScheduler}
                      disabled={schedulerPending}
                      className="gap-2 min-w-[140px]"
                    >
                      <Square className="w-4 h-4" />
                      {schedulerPending ? "Stopping…" : "Stop Auto-Sync"}
                    </Button>
                  ) : (
                    <Button
                      onClick={enableScheduler}
                      disabled={schedulerPending}
                      className="gap-2 min-w-[140px] bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/30"
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
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="w-5 h-5 text-primary" />
                API Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <span className="text-muted-foreground">Core Service</span>
                <Badge variant={(status as any)?.apiHealth === "ok" ? "default" : "destructive"} className="uppercase gap-1">
                  {(status as any)?.apiHealth === "ok"
                    ? <><CheckCircle2 className="w-3 h-3" /> OK</>
                    : <><XCircle className="w-3 h-3" /> Error</>
                  }
                </Badge>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <span className="text-muted-foreground">Sync in Progress</span>
                <Badge variant={isRefreshing ? "default" : "secondary"} className="uppercase">
                  {isRefreshing ? "Yes — running" : "Idle"}
                </Badge>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-muted-foreground">Last Sync</span>
                <span className="font-mono text-sm text-muted-foreground">
                  {(status as any)?.lastRefresh
                    ? new Date((status as any).lastRefresh).toLocaleString()
                    : "Never"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* ── Local Datastore ─────────────────────────────── */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Database className="w-5 h-5 text-primary" />
                Local Datastore
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Satellites",    value: lastUpdate?.satelliteCount ?? 0, color: "text-primary" },
                  { label: "Debris",        value: lastUpdate?.debrisCount ?? 0,    color: "" },
                  { label: "Rocket Bodies", value: lastUpdate?.rocketBodyCount ?? 0, color: "" },
                  {
                    label: "Total Records",
                    value: ((lastUpdate?.satelliteCount ?? 0) + (lastUpdate?.debrisCount ?? 0) + (lastUpdate?.rocketBodyCount ?? 0)),
                    color: "text-muted-foreground",
                  },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-muted/30 p-4 rounded-lg border border-border/50">
                    <div className="text-sm text-muted-foreground mb-1">{label}</div>
                    <div className={`text-2xl font-bold font-mono ${color}`}>{value.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* ── Data Sources ────────────────────────────────── */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Server className="w-5 h-5 text-primary" />
                Upstream Data Sources (CelesTrak)
              </CardTitle>
              <CardDescription>Connection status to external TLE providers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries((status as any)?.dataSourceStatus ?? {}).map(([source, src]) => (
                  <div key={source} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-muted/20 border border-border rounded-lg">
                    <div className="flex items-center gap-3 mb-2 sm:mb-0">
                      <div className={`w-2 h-2 rounded-full ${src === "connected" ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" : "bg-red-500"}`} />
                      <span className="font-medium font-mono text-sm">{source}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <Badge variant="outline" className={src === "connected" ? "text-green-500 border-green-500/30" : "text-red-500 border-red-500/30"}>
                        {String(src)}
                      </Badge>
                      <span className="flex items-center gap-1 font-mono text-xs">
                        <Clock className="w-3 h-3" />
                        Last Sync: {(status as any)?.lastRefresh ? new Date((status as any).lastRefresh).toLocaleString() : "Never"}
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
