import { useState } from "react";
import { Link } from "wouter";
import { useListCollisions, getListCollisionsQueryKey, ListCollisionsRiskLevel } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AlertOctagon, AlertTriangle, ShieldCheck, Activity } from "lucide-react";

export default function Collisions() {
  const [riskLevel, setRiskLevel] = useState<string>("all");
  const limit = 50;

  const { data, isLoading } = useListCollisions(
    { 
      riskLevel: riskLevel !== "all" ? (riskLevel as ListCollisionsRiskLevel) : undefined, 
      limit 
    },
    { 
      query: { 
        queryKey: getListCollisionsQueryKey({ riskLevel: riskLevel !== "all" ? (riskLevel as ListCollisionsRiskLevel) : undefined, limit }) 
      } 
    }
  );

  const getRiskColor = (cat?: string) => {
    switch (cat?.toLowerCase()) {
      case 'low': return 'text-emerald-400 bg-emerald-950/30 border-emerald-500/30';
      case 'medium': return 'text-amber-400 bg-amber-950/30 border-amber-500/30';
      case 'high': return 'text-orange-400 bg-orange-950/30 border-orange-500/30';
      case 'critical': return 'text-red-400 bg-red-950/30 border-red-500/30';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  return (
    <div className="space-y-6 w-full max-w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Close Approach Dashboard</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Conjunction Data Messages (CDM) and predicted conjunction events</p>
        </div>
        
        <div className="w-full sm:w-[200px]">
          <Select value={riskLevel} onValueChange={setRiskLevel}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Risk Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="critical">Critical Only</SelectItem>
              <SelectItem value="high">High & Above</SelectItem>
              <SelectItem value="medium">Medium & Above</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Overview Stat Cards */}
      {!isLoading && data && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <Card className="border-border">
            <CardContent className="pt-5 pb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Monitored</p>
                <h3 className="text-2xl font-bold mt-1 font-mono">{data.total}</h3>
              </div>
              <Activity className="w-7 h-7 text-primary/60" />
            </CardContent>
          </Card>
          <Card className="border-orange-500/40 bg-orange-950/10">
            <CardContent className="pt-5 pb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-orange-400 uppercase tracking-wider">High Risk</p>
                <h3 className="text-2xl font-bold mt-1 text-orange-400 font-mono">{data.highRiskCount}</h3>
              </div>
              <AlertTriangle className="w-7 h-7 text-orange-400/70" />
            </CardContent>
          </Card>
          <Card className="border-red-500/40 bg-red-950/10">
            <CardContent className="pt-5 pb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-red-400 uppercase tracking-wider">Critical Warnings</p>
                <h3 className="text-2xl font-bold mt-1 text-red-400 font-mono">{data.criticalCount}</h3>
              </div>
              <AlertOctagon className="w-7 h-7 text-red-400/70" />
            </CardContent>
          </Card>
        </div>
      )}

      {/* ======================================================== */}
      {/* MOBILE CARD VIEW: Visible only on small screens (md:hidden)*/}
      {/* ======================================================== */}
      <div className="md:hidden space-y-3">
        {isLoading ? (
          Array(5).fill(0).map((_, i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-5 w-40 mb-2" />
              <Skeleton className="h-4 w-28 mb-3" />
              <div className="grid grid-cols-2 gap-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </Card>
          ))
        ) : !data || data.events.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-card rounded-xl border border-border">
            No close approach events logged.
          </div>
        ) : (
          data.events.map((event) => (
            <Card key={event.id} className="p-4 border border-border hover:border-cyan-500/40 transition-colors">
              <div className="flex justify-between items-start gap-2 mb-2">
                <div className="min-w-0">
                  <div className="font-semibold text-sm text-foreground">
                    {event.primaryObject?.name || `NORAD #${event.primaryNoradId}`}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    vs {event.secondaryObject?.name || `NORAD #${event.secondaryNoradId}`}
                  </div>
                </div>
                <Badge variant="outline" className={`font-mono text-[10px] uppercase shrink-0 ${getRiskColor(event.riskLevel)}`}>
                  {event.riskLevel}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-border/50 text-xs font-mono">
                <div className="bg-muted/40 p-2 rounded-lg">
                  <span className="text-[10px] text-muted-foreground uppercase block">Miss Distance</span>
                  <span className="font-semibold text-foreground">{Number(event.missDistanceKm).toFixed(2)} km</span>
                </div>
                <div className="bg-muted/40 p-2 rounded-lg">
                  <span className="text-[10px] text-muted-foreground uppercase block">Probability</span>
                  <span className="font-semibold text-foreground">{event.collisionProbability ? Number(event.collisionProbability).toExponential(2) : '1.0e-5'}</span>
                </div>
                <div className="col-span-2 bg-muted/40 p-2 rounded-lg">
                  <span className="text-[10px] text-muted-foreground uppercase block">Time of Closest Approach</span>
                  <span className="font-semibold text-foreground">{new Date(event.tca).toLocaleString()}</span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* ======================================================== */}
      {/* DESKTOP TABLE VIEW: Visible on tablets and up (hidden md:block)*/}
      {/* ======================================================== */}
      <div className="hidden md:block rounded-xl border border-border overflow-hidden bg-card">
        <div className="w-full overflow-x-auto touch-pan-x">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Object 1</TableHead>
                <TableHead>Object 2</TableHead>
                <TableHead>Miss Distance (km)</TableHead>
                <TableHead>Probability</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead className="text-right">TCA (UTC)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(10).fill(0).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-5 w-28 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : !data || data.events.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No collision risks detected.
                  </TableCell>
                </TableRow>
              ) : (
                data.events.map((event) => (
                  <TableRow key={event.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium text-foreground">
                      {event.primaryObject?.name || event.primaryNoradId}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {event.secondaryObject?.name || event.secondaryNoradId}
                    </TableCell>
                    <TableCell className="font-mono text-foreground font-semibold">
                      {Number(event.missDistanceKm).toFixed(2)}
                    </TableCell>
                    <TableCell className="font-mono text-muted-foreground">
                      {event.collisionProbability ? Number(event.collisionProbability).toExponential(2) : '1.0e-5'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`font-mono text-xs uppercase ${getRiskColor(event.riskLevel)}`}>
                        {event.riskLevel}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs text-muted-foreground">
                      {new Date(event.tca).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
