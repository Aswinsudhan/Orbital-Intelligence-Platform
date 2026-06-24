import { useGetCongestionData, getGetCongestionDataQueryKey, useGetOrbitDistribution, getGetOrbitDistributionQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export default function Analytics() {
  const { data: congestion, isLoading: isLoadingCongestion } = useGetCongestionData({ query: { queryKey: getGetCongestionDataQueryKey() } });
  const { data: distribution, isLoading: isLoadingDist } = useGetOrbitDistribution({ query: { queryKey: getGetOrbitDistributionQueryKey() } });

  const isLoading = isLoadingCongestion || isLoadingDist;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Orbital Analytics</h1>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[400px] w-full rounded-xl" />
          <Skeleton className="h-[400px] w-full rounded-xl" />
          <Skeleton className="h-[400px] w-full rounded-xl md:col-span-2" />
        </div>
      </div>
    );
  }

  if (!congestion || !distribution) {
    return <div className="text-muted-foreground">No data available.</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Orbital Analytics</h1>
      <p className="text-muted-foreground text-lg">Density mapping and historical congestion analysis.</p>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Congestion by Altitude Band</CardTitle>
            <CardDescription>Object count grouped by 100km altitude bands</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={congestion.altitudeBands}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{fill: 'hsl(var(--muted-foreground))'}} tickLine={false} axisLine={false} />
                <YAxis dataKey="label" type="category" width={80} tick={{fill: 'hsl(var(--muted-foreground))'}} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                  itemStyle={{ color: 'hsl(var(--primary))' }}
                  cursor={{fill: 'hsl(var(--muted)/0.5)'}}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orbit Type Distribution</CardTitle>
            <CardDescription>Proportional breakdown of tracked objects</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="count"
                  nameKey="orbitType"
                >
                  {distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                  formatter={(value: number, name: string, props: any) => [`${value} (${props.payload.percentage.toFixed(1)}%)`, name]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Congestion History</CardTitle>
            <CardDescription>Historical trend of total tracked objects</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={congestion.history}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorSat" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDeb" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, {month:'short', year:'2-digit'})}
                  tick={{fill: 'hsl(var(--muted-foreground))'}} tickLine={false} axisLine={false} 
                />
                <YAxis tick={{fill: 'hsl(var(--muted-foreground))'}} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                  labelFormatter={(val) => new Date(val).toLocaleDateString()}
                />
                <Legend />
                <Area type="monotone" dataKey="satellites" name="Satellites" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorSat)" stackId="1" />
                <Area type="monotone" dataKey="debris" name="Debris/Rocket Bodies" stroke="hsl(var(--destructive))" fillOpacity={1} fill="url(#colorDeb)" stackId="1" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}