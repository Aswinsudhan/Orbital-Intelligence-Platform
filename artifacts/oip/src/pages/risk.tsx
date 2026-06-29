import { useState } from "react";
import { Link } from "wouter";
import { useListRiskScores, getListRiskScoresQueryKey, ListRiskScoresCategory } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Info, AlertTriangle, AlertOctagon } from "lucide-react";

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
      case 'low': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getRiskIcon = (cat?: string) => {
    switch (cat?.toLowerCase()) {
      case 'low': return <ShieldCheck className="w-4 h-4 mr-1 inline-block" />;
      case 'medium': return <Info className="w-4 h-4 mr-1 inline-block" />;
      case 'high': return <AlertTriangle className="w-4 h-4 mr-1 inline-block" />;
      case 'critical': return <AlertOctagon className="w-4 h-4 mr-1 inline-block" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Risk Engine</h1>
          <p className="text-muted-foreground mt-1">Multi-factor orbital risk assessment leaderboard</p>
        </div>
        
        <div className="w-full sm:w-[200px]">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
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

      <div className="rounded-xl border border-border overflow-hidden bg-card">
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
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-mono text-sm font-bold border" style={{
                        borderColor: `currentColor`,
                        color: score.category === 'critical' ? 'var(--color-destructive)' : 
                               score.category === 'high' ? 'var(--color-chart-4)' : 
                               score.category === 'medium' ? 'var(--color-chart-3)' : 'var(--color-chart-2)'
                      }}>
                        {score.score}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono font-medium">
                    {(score as any).objectType === "satellite" ? (
                      <Link href={`/satellites/${score.noradId}`} className="text-primary hover:underline">
                        {score.noradId}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground" title="Debris / Rocket Body — no detail page">
                        {score.noradId}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{score.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`uppercase tracking-wider text-[10px] ${getRiskColor(score.category)}`}>
                      {getRiskIcon(score.category)}
                      {score.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm text-muted-foreground">
                    {new Date(score.lastCalculated).toLocaleString()}
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