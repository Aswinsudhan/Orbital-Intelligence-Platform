import { useGetCongestionData, getGetCongestionDataQueryKey, useGetOrbitDistribution, getGetOrbitDistributionQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const ORBIT_COLORS: Record<string, string> = {
  "LEO":            "#00d4ff",   // cyan
  "MEO":            "#a855f7",   // violet
  "GEO":            "#f59e0b",   // amber
  "HEO":            "#22c55e",   // green
  "Debris/R-Bodies":"#ef4444",   // red
  "Unknown":        "#94a3b8",   // slate
};
const FALLBACK_COLORS = ["#00d4ff","#a855f7","#f59e0b","#22c55e","#ef4444","#94a3b8","#ec4899","#f97316","#14b8a6"];

export default function Analytics() {
  const { data: congestion, isLoading: isLoadingCongestion } = useGetCongestionData({ query: { queryKey: getGetCongestionDataQueryKey() } });
  const { data: distribution, isLoading: isLoadingDist } = useGetOrbitDistribution({ query: { queryKey: getGetOrbitDistributionQueryKey() } });

  const isLoading = isLoadingCongestion || isLoadingDist;

  if (isLoading) {
    return (
      <div className="space-y-6 w-full max-w-full">
        <div>
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <Skeleton className="h-[380px] w-full rounded-xl" />
          <Skeleton className="h-[380px] w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!congestion || !distribution) {
    return (
      <div className="text-center py-12 text-muted-foreground font-mono">
        No analytics data available.
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-full">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Orbital Analytics</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Density mapping and historical congestion analysis across altitude shells</p>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {/* Congestion Bar Chart */}
        <Card className="min-w-0 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg">Congestion by Altitude Band</CardTitle>
            <CardDescription className="text-xs">Object count grouped by 100km altitude bands</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px] sm:h-[400px] p-2 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={congestion.altitudeBands}
                layout="vertical"
                margin={{ top: 5, right: 15, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 11}} tickLine={false} axisLine={false} />
                <YAxis dataKey="label" type="category" width={70} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 10}} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: 'hsl(var(--primary))' }}
                  cursor={{fill: 'hsl(var(--muted)/0.5)'}}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Orbit Type Distribution Pie Chart */}
        <Card className="min-w-0 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg">Orbit Type Distribution</CardTitle>
            <CardDescription className="text-xs">Proportional breakdown of tracked objects</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px] sm:h-[400px] p-2 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <Pie
                  data={distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={105}
                  paddingAngle={2}
                  dataKey="count"
                  nameKey="orbitType"
                >
                  {distribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={ORBIT_COLORS[entry.orbitType] ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                  formatter={(value: any, name: string, props: any) => [`${value} (${props.payload.percentage.toFixed(1)}%)`, name]}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
