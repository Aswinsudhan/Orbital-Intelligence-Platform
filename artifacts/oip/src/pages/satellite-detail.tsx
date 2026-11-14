import { useParams, Link } from "wouter";
import { useGetSatellite, getGetSatelliteQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, AlertTriangle, ShieldCheck, AlertOctagon, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SatelliteDetail() {
  const { id } = useParams();
  const satId = parseInt(id || "0", 10);

  const { data: sat, isLoading } = useGetSatellite(satId, { 
    query: { 
      enabled: !!satId,
      queryKey: getGetSatelliteQueryKey(satId) 
    } 
  });

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto w-full">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-[280px] w-full rounded-xl" />
            <Skeleton className="h-[180px] w-full rounded-xl" />
          </div>
          <Skeleton className="h-[350px] w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!sat) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Satellite not found</h2>
        <Button asChild variant="outline" className="min-h-[44px]">
          <Link href="/satellites">Return to Catalog</Link>
        </Button>
      </div>
    );
  }

  const getRiskColor = (category?: string | null) => {
    switch (category?.toLowerCase()) {
      case 'low': return 'text-emerald-400 bg-emerald-950/30 border-emerald-500/30';
      case 'medium': return 'text-amber-400 bg-amber-950/30 border-amber-500/30';
      case 'high': return 'text-orange-400 bg-orange-950/30 border-orange-500/30';
      case 'critical': return 'text-red-400 bg-red-950/30 border-red-500/30';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getRiskIcon = (category?: string | null) => {
    switch (category?.toLowerCase()) {
      case 'low': return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'medium': return <Info className="w-4 h-4 text-amber-400" />;
      case 'high': return <AlertTriangle className="w-4 h-4 text-orange-400" />;
      case 'critical': return <AlertOctagon className="w-4 h-4 text-red-400" />;
      default: return <Info className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto w-full">
      <div className="flex items-start sm:items-center gap-3 mb-2">
        <Button variant="ghost" size="icon" asChild className="rounded-full min-h-[44px] min-w-[44px] shrink-0">
          <Link href="/satellites"><ChevronLeft className="w-5 h-5" /></Link>
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">{sat.name}</h1>
          <div className="flex items-center gap-2.5 mt-1 flex-wrap">
            <Badge variant="outline" className="font-mono text-cyan-400 border-cyan-500/40 text-xs">NORAD #{sat.noradId}</Badge>
            <span className="text-xs text-muted-foreground font-mono">DB ID: {sat.id}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">Orbital Parameters</CardTitle>
              <CardDescription className="text-xs">Latest telemetry data from CelesTrak element sets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-3 sm:gap-x-4">
                <div className="bg-muted/30 p-3 rounded-xl border border-border/50">
                  <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Orbit Type</div>
                  <div className="font-mono text-base sm:text-lg font-bold text-foreground">{sat.orbitType}</div>
                </div>
                <div className="bg-muted/30 p-3 rounded-xl border border-border/50">
                  <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Altitude</div>
                  <div className="font-mono text-base sm:text-lg font-bold text-cyan-400">{sat.altitude != null ? `${sat.altitude.toFixed(1)} km` : "N/A"}</div>
                </div>
                <div className="bg-muted/30 p-3 rounded-xl border border-border/50">
                  <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Inclination</div>
                  <div className="font-mono text-base sm:text-lg font-bold text-foreground">{sat.inclination != null ? `${sat.inclination.toFixed(2)}°` : "N/A"}</div>
                </div>
                <div className="bg-muted/30 p-3 rounded-xl border border-border/50">
                  <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Velocity</div>
                  <div className="font-mono text-base sm:text-lg font-bold text-cyan-400">{sat.velocity != null ? `${sat.velocity.toFixed(2)} km/s` : "7.66 km/s"}</div>
                </div>
                <div className="bg-muted/30 p-3 rounded-xl border border-border/50">
                  <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Eccentricity</div>
                  <div className="font-mono text-base sm:text-lg font-bold text-foreground">{sat.eccentricity != null ? sat.eccentricity.toFixed(5) : "N/A"}</div>
                </div>
                <div className="bg-muted/30 p-3 rounded-xl border border-border/50">
                  <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">RAAN</div>
                  <div className="font-mono text-base sm:text-lg font-bold text-foreground">{sat.raan != null ? `${sat.raan.toFixed(2)}°` : "N/A"}</div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-border/50 text-[11px] font-mono text-muted-foreground space-y-1">
                <div>Epoch: {sat.epoch ? new Date(sat.epoch).toLocaleString() : 'N/A'}</div>
                <div>Last CelesTrak Ingestion: {sat.lastUpdated ? new Date(sat.lastUpdated).toLocaleString() : 'N/A'}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg">Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center py-6">
              {sat.riskScore != null ? (
                <>
                  <div className="relative w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center mb-6">
                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/30" />
                      <circle 
                        cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" 
                        strokeDasharray="283" 
                        strokeDashoffset={283 - (283 * sat.riskScore) / 100}
                        className={
                          sat.riskCategory === 'critical' ? 'text-red-500' :
                          sat.riskCategory === 'high' ? 'text-orange-500' :
                          sat.riskCategory === 'medium' ? 'text-amber-500' : 'text-emerald-500'
                        }
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl sm:text-4xl font-bold font-mono">{sat.riskScore}</span>
                      <span className="text-[10px] text-muted-foreground uppercase">Threat Index</span>
                    </div>
                  </div>
                  <Badge variant="outline" className={`px-4 py-1.5 text-xs uppercase tracking-widest ${getRiskColor(sat.riskCategory)}`}>
                    <span className="flex items-center gap-1.5">
                      {getRiskIcon(sat.riskCategory)}
                      {sat.riskCategory} Risk
                    </span>
                  </Badge>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground text-xs font-mono">
                  Risk score currently uncalculated
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
