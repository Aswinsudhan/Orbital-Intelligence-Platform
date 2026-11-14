import { useState } from "react";
import { Link } from "wouter";
import { useListRiskScores, getListRiskScoresQueryKey, ListRiskScoresCategory } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ShieldCheck, Info, AlertTriangle, AlertOctagon, ChevronRight } from "lucide-react";

export default function RiskEngine() {
  const [category, setCategory] = useState<string>("all");
  const limit = 50;

  const { data, isLoading } = useListRiskScores(
    { 
      category: category !== "all" ? (category as ListRiskScoresCategory) : undefined, 
      limit 
    },
    { 
      query: { 
        queryKey: getListRiskScoresQueryKey({ category: category !== "all" ? (category as ListRiskScoresCategory) : undefined, limit }) 
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

  const getRiskIcon = (cat?: string) => {
    switch (cat?.toLowerCase()) {
      case 'low': return <ShieldCheck className="w-3.5 h-3.5 mr-1 inline-block" />;
      case 'medium': return <Info className="w-3.5 h-3.5 mr-1 inline-block" />;
      case 'high': return <AlertTriangle className="w-3.5 h-3.5 mr-1 inline-block" />;
      case 'critical': return <AlertOctagon className="w-3.5 h-3.5 mr-1 inline-block" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 w-full max-w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Risk Engine</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Multi-factor orbital collision and debris hazard assessment</p>
        </div>
        
        <div className="w-full sm:w-[200px]">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Risk Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="critical">Critical Only</SelectItem>
              <SelectItem value="high">High & Above</SelectItem>
              <SelectItem value="medium">Medium & Above</SelectItem>
              <SelectItem value="low">Low Risk</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MOBILE CARD VIEW: Visible only on small screens (md:hidden)*/}
      {/* ======================================================== */}
      <div className="md:hidden space-y-3">
        {isLoading ? (
          Array(5).fill(0).map((_, i) => (
            <Card key={i} className="p-4">
              <div className="flex justify-between items-center mb-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-6 w-14 rounded-full" />
              </div>
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-2 w-full rounded-full" />
            </Card>
          ))
        ) : !data || data.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-card rounded-xl border border-border">
            No risk scores found.
          </div>
        ) : (
          data.map((score) => {
            const numScore = Math.round(Number(score.overallScore));
            return (
              <Card key={score.noradId} className="p-4 border border-border hover:border-cyan-500/40 transition-colors">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-base text-foreground truncate">
                      {score.satellite?.name || `Object #${score.noradId}`}
                    </h3>
                    <p className="text-xs font-mono text-cyan-400">NORAD #{score.noradId}</p>
                  </div>
                  <Badge variant="outline" className={`font-mono text-[10px] uppercase shrink-0 ${getRiskColor(score.riskCategory)}`}>
                    {getRiskIcon(score.riskCategory)}
                    {score.riskCategory}
                  </Badge>
                </div>

                {/* Score Progress Bar */}
                <div className="mt-3 pt-2 border-t border-border/50">
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-muted-foreground">Threat Score</span>
                    <span className="font-bold text-foreground">{numScore} / 100</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        numScore >= 75 ? 'bg-red-500' :
                        numScore >= 50 ? 'bg-orange-500' :
                        numScore >= 25 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(numScore, 100)}%` }}
                    />
                  </div>
                </div>
              </Card>
            );
          })
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
                <TableHead className="w-[120px]">Score (0-100)</TableHead>
                <TableHead>NORAD ID</TableHead>
                <TableHead>Object Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Last Calculated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(10).fill(0).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-6 w-12 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-5 w-24 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : !data || data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No risk scores found.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((score) => (
                  <TableRow key={score.noradId} className="hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <span className="font-mono font-bold text-base">
                        {Math.round(Number(score.overallScore))}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-primary font-medium">
                      {score.satellite?.id ? (
                        <Link href={`/satellites/${score.satellite.id}`} className="hover:underline">
                          {score.noradId}
                        </Link>
                      ) : (
                        score.noradId
                      )}
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      {score.satellite?.name || `Object #${score.noradId}`}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`font-mono text-xs uppercase ${getRiskColor(score.riskCategory)}`}>
                        {getRiskIcon(score.riskCategory)}
                        {score.riskCategory}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs text-muted-foreground">
                      {score.calculatedAt ? new Date(score.calculatedAt).toLocaleString() : 'N/A'}
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
