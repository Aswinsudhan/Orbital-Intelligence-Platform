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
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Skeleton className="h-[300px] w-full" />
            <Skeleton className="h-[200px] w-full" />
          </div>
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    );
  }

  if (!sat) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Satellite not found</h2>
        <Button asChild variant="outline">
          <Link href="/satellites">Return to Catalog</Link>
        </Button>
      </div>
    );
  }

  const getRiskColor = (category?: string | null) => {
    switch (category?.toLowerCase()) {
      case 'low': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getRiskIcon = (category?: string | null) => {
    switch (category?.toLowerCase()) {
      case 'low': return <ShieldCheck className="w-5 h-5 text-green-500" />;
      case 'medium': return <Info className="w-5 h-5 text-amber-500" />;
      case 'high': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'critical': return <AlertOctagon className="w-5 h-5 text-red-500" />;
      default: return <Info className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-2">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/satellites"><ChevronLeft className="w-5 h-5" /></Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{sat.name}</h1>
          <div className="flex items-center gap-3 mt-1">
            <Badge variant="outline" className="font-mono text-primary">NORAD {sat.noradId}</Badge>
            <span className="text-sm text-muted-foreground font-mono">ID: {sat.id}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Orbital Elements</CardTitle>
              <CardDescription>Latest telemetry data from CelesTrak</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Orbit Type</div>
                  <div className="font-mono text-lg font-medium">{sat.orbitType}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Altitude</div>
                  <div className="font-mono text-lg">{sat.altitude != null ? `${sat.altitude.toFixed(2)} km` : "N/A"}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Inclination</div>
                  <div className="font-mono text-lg">{sat.inclination != null ? `${sat.inclination.toFixed(4)}°` : "N/A"}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Velocity</div>
                  <div className="font-mono text-lg">{sat.velocity != null ? `${sat.velocity.toFixed(3)} km/s` : "N/A"}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Eccentricity</div>
                  <div className="font-mono text-lg">{sat.eccentricity != null ? sat.eccentricity.toFixed(6) : "N/A"}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">RAAN</div>
                  <div className="font-mono text-lg">{sat.raan != null ? `${sat.raan.toFixed(4)}°` : "N/A"}</div>
                </div>
              </div>
              <div className="mt-8 pt-4 border-t border-border/50 text-xs font-mono text-muted-foreground">
                Epoch: {new Date(sat.epoch).toLocaleString()}<br/>
                Last updated: {new Date(sat.lastUpdated).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Risk Profile</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center py-6">
              {sat.riskScore != null ? (
                <>
                  <div className="relative w-40 h-40 flex items-center justify-center mb-6">
                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/30" />
                      <circle 
                        cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" 
                        strokeDasharray="283" 
                        strokeDashoffset={283 - (283 * sat.riskScore) / 100}
                        className={
                          sat.riskCategory === 'critical' ? 'text-red-500' :
                          sat.riskCategory === 'high' ? 'text-orange-500' :
                          sat.riskCategory === 'medium' ? 'text-amber-500' : 'text-green-500'
                        }
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold font-mono">{sat.riskScore}</span>
                      <span className="text-xs text-muted-foreground">/ 100</span>
                    </div>
                  </div>
                  <Badge variant="outline" className={`px-4 py-1.5 text-sm uppercase tracking-widest ${getRiskColor(sat.riskCategory)}`}>
                    <span className="flex items-center gap-2">
                      {getRiskIcon(sat.riskCategory)}
                      {sat.riskCategory} Risk
                    </span>
                  </Badge>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Risk score not calculated
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}