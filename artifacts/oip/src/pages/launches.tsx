import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Rocket, MapPin, Clock, Globe, Calendar } from "lucide-react";

interface Launch {
  id: string;
  name: string;
  status: string;
  statusAbbrev: string;
  launchTime: string;
  provider: string;
  providerType: string;
  rocket: string;
  rocketFamily: string;
  missionName: string;
  missionType: string;
  missionDescription: string;
  orbit: string | null;
  orbitAbbrev: string | null;
  padName: string;
  location: string;
  countryCode: string;
  image: string | null;
  webcastLive: boolean;
  program: string | null;
}

function statusColor(abbrev: string): string {
  switch (abbrev) {
    case "Go": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    case "Success": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "Failure": return "bg-red-500/20 text-red-400 border-red-500/30";
    case "TBD": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "Hold": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    default: return "bg-muted/50 text-muted-foreground border-border";
  }
}

function Countdown({ target }: { target: string }) {
  const [diff, setDiff] = useState(new Date(target).getTime() - Date.now());

  useEffect(() => {
    const id = setInterval(() => setDiff(new Date(target).getTime() - Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (diff <= 0) return <span className="text-emerald-400 font-mono text-sm">Launched</span>;

  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  return (
    <span className="font-mono text-xs sm:text-sm text-primary tabular-nums">
      T‑{d > 0 ? `${d}d ` : ""}{String(h).padStart(2, "0")}:{String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
    </span>
  );
}

const DEFAULT_FALLBACK_IMG = "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=800&q=80";

function LaunchCard({ launch, upcoming }: { launch: Launch; upcoming: boolean }) {
  const date = new Date(launch.launchTime);
  const imgSrc = launch.image || DEFAULT_FALLBACK_IMG;

  return (
    <Card className="overflow-hidden hover:border-primary/40 transition-colors">
      <div className="flex flex-col sm:flex-row">
        <div className="w-full sm:w-52 h-40 sm:h-auto shrink-0 overflow-hidden bg-muted relative">
          <img
            src={imgSrc}
            alt={launch.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src !== DEFAULT_FALLBACK_IMG) {
                target.src = DEFAULT_FALLBACK_IMG;
              }
            }}
          />
        </div>
        <CardContent className="p-3 sm:p-4 flex-1 space-y-2.5">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] sm:text-xs text-muted-foreground font-medium uppercase tracking-wider mb-0.5">{launch.provider}</p>
              <h3 className="font-bold text-sm sm:text-base leading-tight truncate">{launch.missionName}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">{launch.rocket}</p>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className={`text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full border ${statusColor(launch.statusAbbrev)}`}>
                {launch.status}
              </span>
              {launch.orbit && (
                <Badge variant="outline" className="text-[10px]">{launch.orbitAbbrev ?? launch.orbit}</Badge>
              )}
            </div>
          </div>

          {launch.missionDescription && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {launch.missionDescription}
            </p>
          )}

          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] sm:text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate max-w-[200px]">{launch.location}</span>
            </span>
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3 shrink-0" />
              {launch.missionType}
            </span>
            {launch.program && (
              <span className="flex items-center gap-1">
                <Rocket className="w-3 h-3 shrink-0" />
                {launch.program}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-border/60">
            <span className="flex items-center gap-1.5 text-[10px] sm:text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              {date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
              {" · "}
              {date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })} UTC
            </span>
            {upcoming && launch.statusAbbrev !== "Success" && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-primary" />
                <Countdown target={launch.launchTime} />
              </span>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

function useLaunches(tab: "upcoming" | "recent") {
  const [data, setData] = useState<{ total: number; results: Launch[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const baseUrl = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "") || "";
    const endpoint = `${baseUrl}/api/launches/${tab}?limit=30`;

    fetch(endpoint)
      .then(async (r) => {
        if (!r.ok) {
          const text = await r.text().catch(() => "");
          throw new Error(`HTTP ${r.status}${text ? `: ${text.slice(0, 100)}` : ""}`);
        }
        const contentType = r.headers.get("content-type");
        if (contentType && contentType.includes("text/html")) {
          const text = await r.text().catch(() => "");
          if (text.startsWith("<!DOCTYPE") || text.includes("<html")) {
            throw new Error("Received HTML response instead of JSON. Make sure VITE_API_URL environment variable is set or proxy redirect rule is active.");
          }
        }
        return r.json();
      })
      .then((d) => { setData(d); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, [tab]);

  return { data, loading, error };
}

export default function Launches() {
  const [tab, setTab] = useState<"upcoming" | "recent">("upcoming");
  const { data, loading, error } = useLaunches(tab);

  return (
    <div className="space-y-6 max-w-5xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Launch Manifest</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Real-time orbital launch schedules from Launch Library 2
          </p>
        </div>

        <div className="flex rounded-xl border border-border overflow-hidden shrink-0 self-start sm:self-auto bg-card">
          {(["upcoming", "recent"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-xs sm:text-sm font-medium transition-colors capitalize min-h-[44px] ${
                tab === t
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-card text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {t === "upcoming" ? "Upcoming" : "Recent"}
            </button>
          ))}
        </div>
      </div>

      {data && !loading && (
        <p className="text-xs text-muted-foreground font-mono">
          {tab === "upcoming"
            ? `${data.total} upcoming launches scheduled`
            : `${data.total.toLocaleString()} completed launches logged`}
        </p>
      )}

      {loading && (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-36 w-full rounded-xl" />
          ))}
        </div>
      )}

      {error && (
        <div className="p-4 sm:p-6 rounded-xl border border-destructive/40 bg-destructive/10 text-destructive text-xs sm:text-sm font-mono">
          Failed to load launch data: {error}
        </div>
      )}

      {!loading && !error && data && (
        <div className="space-y-3">
          {data.results.map((launch) => (
            <LaunchCard key={launch.id} launch={launch} upcoming={tab === "upcoming"} />
          ))}
          {data.results.length === 0 && (
            <p className="text-muted-foreground text-center py-12">No launches found.</p>
          )}
        </div>
      )}
    </div>
  );
}
