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
      case 'low': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Close Approach Dashboard</h1>
          <p className="text-muted-foreground mt-1">Conjunction Data Messages (CDM) and predicted collision events</p>
        </div>
        
        <div className="w-full sm:w-[200px]">
          <Select value={riskLevel} onValueChange={setRiskLevel}>
            <SelectTrigger>
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

      {!isLoading && data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border">
            <CardContent className="pt-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Monitored Events</p>
                <h3 className="text-2xl font-bold mt-1">{data.total}</h3>
              </div>
              <Activity className="w-8 h-8 text-primary/50" />
            </CardContent>
          </Card>
          <Card className="border-orange-500/30">
            <CardContent className="pt-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-500">High Risk Approaches</p>
                <h3 className="text-2xl font-bold mt-1 text-orange-500">{data.highRiskCount}</h3>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500/50" />
            </CardContent>
          </Card>
          <Card className="border-red-500/30">
            <CardContent className="pt-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-500">Critical Warnings</p>
                <h3 className="text-2xl font-bold mt-1 text-red-500">{data.criticalCount}</h3>
              </div>
              <AlertOctagon className="w-8 h-8 text-red-500/50" />
            </CardContent>
          </Card>
        </div>
      )}

      <div className="rounded-xl border border-border overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Object 1</TableHead>
              <TableHead>Object 2</TableHead>
              <TableHead>Miss Distance (km)</TableHead>
              <TableHead>Probability</TableHead>
              <TableHead>Risk Level</TableHead>
              <TableHead className="text-right">TCA (Time of Closest Approach)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(10).fill(0).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-5 w-32 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : !data || data.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No collision events found matching criteria.
                </TableCell>
              </TableRow>
            ) : (
              data.data.map((event) => (
                <TableRow key={event.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell>
                    <div className="font-medium">{event.object1Name}</div>
                    <div className="text-xs text-muted-foreground font-mono">NORAD: {event.object1NoradId}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{event.object2Name}</div>
                    <div className="text-xs text-muted-foreground font-mono">NORAD: {event.object2NoradId}</div>
                  </TableCell>
                  <TableCell className="font-mono font-medium">
                    {event.missDistanceKm.toFixed(3)}
                  </TableCell>
                  <TableCell className="font-mono text-muted-foreground">
                    {event.probability != null ? (event.probability * 100).toExponential(2) + '%' : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`uppercase tracking-wider text-[10px] ${getRiskColor(event.riskLevel)}`}>
                      {event.riskLevel}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {event.predictedTime ? new Date(event.predictedTime).toLocaleString() : 'Unknown'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}