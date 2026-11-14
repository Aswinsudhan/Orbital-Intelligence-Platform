import { useState } from "react";
import { useGetOrbitalForecast, getGetOrbitalForecastQueryKey, GetOrbitalForecastHorizon } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Area, Line } from "recharts";
import { TrendingUp } from "lucide-react";

export default function Forecast() {
  const [horizon, setHorizon] = useState<GetOrbitalForecastHorizon>("90d");

  const { data, isLoading } = useGetOrbitalForecast(
    { horizon },
    { query: { queryKey: getGetOrbitalForecastQueryKey({ horizon }) } }
  );

  return (
    <div className="space-y-6 w-full max-w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Congestion Forecast</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Predictive modeling of orbital object density over future horizons</p>
        </div>
        
        <ToggleGroup 
          type="single" 
          value={horizon} 
          onValueChange={(v) => v && setHorizon(v as GetOrbitalForecastHorizon)}
          className="bg-card border border-border p-1 rounded-xl self-start sm:self-auto"
        >
          <ToggleGroupItem value="30d" className="min-h-[40px] px-3 text-xs">30 Days</ToggleGroupItem>
          <ToggleGroupItem value="90d" className="min-h-[40px] px-3 text-xs">90 Days</ToggleGroupItem>
          <ToggleGroupItem value="1y" className="min-h-[40px] px-3 text-xs">1 Year</ToggleGroupItem>
        </ToggleGroup>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </div>
          <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
      ) : !data ? (
        <div className="text-center py-12 text-muted-foreground font-mono">
          No forecast data available.
        </div>
      ) : (
        <div className="grid gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <Card>
              <CardContent className="pt-5 pb-5">
                <div className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Predicted Trend</div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span className="text-xl sm:text-2xl font-bold uppercase">{data.trend}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 pb-5">
                <div className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Model Confidence</div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400">{(data.confidence * 100).toFixed(1)}%</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 pb-5">
                <div className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Forecast Horizon</div>
                <div className="text-xl sm:text-2xl font-bold uppercase">{data.horizon}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="min-w-0 overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg">Projected Object Count</CardTitle>
              <CardDescription className="text-xs">Predicted total objects with statistical confidence intervals</CardDescription>
            </CardHeader>
            <CardContent className="h-[340px] sm:h-[450px] p-2 min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={data.dataPoints}
                  margin={{ top: 15, right: 15, left: 0, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="confidenceBand" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                    tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 11}} tickLine={false} axisLine={false} 
                  />
                  <YAxis 
                    domain={['auto', 'auto']}
                    width={55}
                    tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 10}} 
                    tickLine={false} axisLine={false} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                    labelFormatter={(val) => new Date(val).toLocaleDateString()}
                    formatter={(value: any, name: string) => [
                      <span key="val" className="font-mono">{Number(value).toLocaleString()}</span>, 
                      name === 'predicted' ? 'Predicted' : name === 'upper' ? 'Upper Bound' : 'Lower Bound'
                    ]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="upper" 
                    stroke="none" 
                    fill="url(#confidenceBand)" 
                    name="upper"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="predicted" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={false}
                    name="predicted"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
