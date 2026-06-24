import { useState } from "react";
import { useGetOrbitalForecast, getGetOrbitalForecastQueryKey, GetOrbitalForecastHorizon } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Line } from "recharts";
import { TrendingUp, AlertCircle } from "lucide-react";

export default function Forecast() {
  const [horizon, setHorizon] = useState<GetOrbitalForecastHorizon>("90d");

  const { data, isLoading } = useGetOrbitalForecast(
    { horizon },
    { query: { queryKey: getGetOrbitalForecastQueryKey({ horizon }) } }
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Congestion Forecast</h1>
          <p className="text-muted-foreground mt-1">Predictive modeling of orbital object density</p>
        </div>
        
        <ToggleGroup type="single" value={horizon} onValueChange={(v) => v && setHorizon(v as GetOrbitalForecastHorizon)}>
          <ToggleGroupItem value="30d">30 Days</ToggleGroupItem>
          <ToggleGroupItem value="90d">90 Days</ToggleGroupItem>
          <ToggleGroupItem value="1y">1 Year</ToggleGroupItem>
        </ToggleGroup>
      </div>

      {isLoading ? (
        <Skeleton className="h-[500px] w-full rounded-xl" />
      ) : !data ? (
        <div className="text-muted-foreground">No forecast data available.</div>
      ) : (
        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm font-medium text-muted-foreground mb-2">Predicted Trend</div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span className="text-2xl font-bold uppercase">{data.trend}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm font-medium text-muted-foreground mb-2">Model Confidence</div>
                <div className="text-2xl font-bold font-mono">{(data.confidence * 100).toFixed(1)}%</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm font-medium text-muted-foreground mb-2">Forecast Horizon</div>
                <div className="text-2xl font-bold uppercase">{data.horizon}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Projected Object Count</CardTitle>
              <CardDescription>Predicted total objects with confidence intervals</CardDescription>
            </CardHeader>
            <CardContent className="h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={data.dataPoints}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
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
                    tick={{fill: 'hsl(var(--muted-foreground))'}} tickLine={false} axisLine={false} 
                  />
                  <YAxis 
                    domain={['auto', 'auto']}
                    tick={{fill: 'hsl(var(--muted-foreground))', fontFamily: 'var(--font-mono)'}} 
                    tickLine={false} axisLine={false} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                    labelFormatter={(val) => new Date(val).toLocaleDateString()}
                    formatter={(value: number, name: string) => [
                      <span className="font-mono">{value.toLocaleString()}</span>, 
                      name === 'predicted' ? 'Predicted' : name === 'upper' ? 'Upper Bound' : 'Lower Bound'
                    ]}
                  />
                  {/* The area represents the confidence band. We map 'lower' and 'upper' using an array dataKey */}
                  <Area 
                    type="monotone" 
                    dataKey={(data) => [data.lower, data.upper]} 
                    stroke="none" 
                    fill="url(#confidenceBand)" 
                    name="Confidence Interval"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="predicted" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3} 
                    dot={false} 
                    name="Predicted"
                    activeDot={{ r: 6, fill: 'hsl(var(--primary))', stroke: 'hsl(var(--background))', strokeWidth: 2 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg border border-border text-sm text-muted-foreground">
            <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p>
              Forecast models use historical CelesTrak data and known launch manifests to predict orbital congestion. 
              The confidence interval widens further into the future due to unpredicted fragmentation events and undisclosed launches.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}