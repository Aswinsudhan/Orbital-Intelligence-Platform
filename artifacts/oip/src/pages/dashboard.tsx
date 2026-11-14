import { useGetAnalyticsOverview, getGetAnalyticsOverviewQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Satellite, Trash2, Rocket, AlertTriangle, AlertOctagon, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

export default function Dashboard() {
  const { data: overview, isLoading } = useGetAnalyticsOverview({ query: { queryKey: getGetAnalyticsOverviewQueryKey() } });

  if (isLoading) {
    return (
      <div className="space-y-6 w-full max-w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-40" />
        </div>
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <Skeleton className="h-[320px] rounded-xl" />
          <Skeleton className="h-[320px] rounded-xl" />
        </div>
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="text-center py-12 text-muted-foreground font-mono">
        No orbital data available — trigger a refresh in Admin to sync from CelesTrak.
      </div>
    );
  }

  const COLORS = ['#00d4ff', '#a855f7', '#f59e0b', '#22c55e', '#ef4444'];

  return (
    <div className="space-y-6 w-full max-w-full">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Mission Dashboard</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Real-time orbital tracking and Space Situational Awareness</p>
        </div>
        <div className="text-xs text-muted-foreground font-mono bg-card/60 border border-border/80 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 self-start sm:self-auto">
          <RefreshCw className="w-3 h-3 text-primary animate-spin-slow" />
          <span>Last refresh: {overview.lastRefresh ? new Date(overview.lastRefresh).toLocaleString() : 'N/A'}</span>
        </div>
      </div>

      {/* 4 Metric Cards: Responsive 1 col on mobile, 2 col on tablet, 4 on desktop */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Active Satellites */}
        <Card className="hover:border-cyan-500/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-slate-300">Active Satellites</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center">
              <Satellite className="h-4 w-4 text-cyan-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-cyan-400">
              {overview.totalSatellites.toLocaleString()}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Operational spacecraft in orbit</p>
          </CardContent>
        </Card>

        {/* Debris Objects */}
        <Card className="hover:border-orange-500/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-slate-300">Debris Objects</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-orange-950/40 border border-orange-500/30 flex items-center justify-center">
              <Trash2 className="h-4 w-4 text-orange-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-orange-400">
              {overview.totalDebris.toLocaleString()}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Tracked orbital fragmentation debris</p>
          </CardContent>
        </Card>

        {/* Rocket Bodies */}
        <Card className="hover:border-pink-500/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-slate-300">Rocket Bodies</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-pink-950/40 border border-pink-500/30 flex items-center justify-center">
              <Rocket className="h-4 w-4 text-pink-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-pink-400">
              {overview.totalRocketBodies.toLocaleString()}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Spent booster stages in orbit</p>
          </CardContent>
        </Card>

        {/* High Risk Objects */}
        <Card className="border-orange-500/50 hover:border-orange-400 transition-colors bg-gradient-to-b from-orange-950/10 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-orange-400">High Risk Objects</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-orange-950/50 border border-orange-500/40 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-orange-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-orange-400">
              {overview.highRiskObjects.toLocaleString()}
            </div>
            {overview.criticalRiskObjects ? (
              <p className="text-xs text-red-400 mt-1 flex items-center gap-1 font-semibold">
                <AlertOctagon className="w-3.5 h-3.5" />
                {overview.criticalRiskObjects} critical priority
              </p>
            ) : (
              <p className="text-[11px] text-muted-foreground mt-1">Requiring collision avoidance</p>
            )}
          </CardContent>
        </Card>

      </div>

      {/* Charts & Warnings */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        
        {/* Orbit Distribution Pie Chart */}
        <Card className="min-w-0 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg">Orbit Distribution</CardTitle>
            <p className="text-xs text-muted-foreground">Proportion of objects by orbital regime</p>
          </CardHeader>
          <CardContent className="h-[280px] sm:h-[320px] p-2 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <Pie
                  data={overview.orbitBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="count"
                  nameKey="orbitType"
                >
                  {overview.orbitBreakdown.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Recent Collision Warnings Card */}
        {overview.recentCollisionWarnings ? (
          <Card className="min-w-0 border-destructive/60 bg-gradient-to-b from-destructive/10 to-transparent flex flex-col justify-between">
            <CardHeader className="pb-2">
              <CardTitle className="text-destructive flex items-center gap-2 text-base sm:text-lg">
                <AlertOctagon className="w-5 h-5 shrink-0" />
                Recent Collision Warnings
              </CardTitle>
              <p className="text-xs text-muted-foreground">Active conjunction alerts generated within the last 24h</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-4xl sm:text-5xl font-bold font-mono text-destructive">
                {overview.recentCollisionWarnings}
              </div>
              <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-3 text-xs text-destructive-foreground/90 space-y-1 font-mono">
                <p className="font-semibold">⚠️ Action Recommended</p>
                <p className="text-[11px] text-muted-foreground">
                  Close conjunction events indicate spacecraft passing within critical miss thresholds. Review the Collisions tab for maneuver recommendations.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="min-w-0 border-border flex flex-col justify-between">
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg">Space Traffic Assessment</CardTitle>
              <p className="text-xs text-muted-foreground">Automated orbital density index</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl sm:text-4xl font-bold font-mono text-emerald-400">
                NOMINAL
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                All tracked orbital paths are evaluated continuously using SGP4 analytical propagation. No unmitigated critical conjunctions currently logged.
              </p>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}
