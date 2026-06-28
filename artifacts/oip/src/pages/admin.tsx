import { useGetAdminStatus, getGetAdminStatusQueryKey, useTriggerRefresh, useGetLastUpdate } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Database, RefreshCw, Server, Activity, Clock, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: status, isLoading: isLoadingStatus } = useGetAdminStatus({ query: { queryKey: getGetAdminStatusQueryKey() } });
  const { data: lastUpdate, isLoading: isLoadingUpdate } = useGetLastUpdate();
  
  const refreshMutation = useTriggerRefresh({
    mutation: {
      onSuccess: (data) => {
        toast({
          title: "Refresh Initiated",
          description: data.message,
        });
        // Invalidate status queries
        queryClient.invalidateQueries({ queryKey: getGetAdminStatusQueryKey() });
      },
      onError: (error: any) => {
        toast({
          title: "Refresh Failed",
          description: error?.response?.data?.error || "An unknown error occurred.",
          variant: "destructive"
        });
      }
    }
  });

  const isLoading = isLoadingStatus || isLoadingUpdate;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Administration</h1>
          <p className="text-muted-foreground mt-1">Platform health and data sources — sync is manual</p>
        </div>
        
        <Button 
          onClick={() => refreshMutation.mutate(undefined as any)} 
          disabled={refreshMutation.isPending}
          size="lg"
          className="gap-2 shadow-lg shadow-primary/20"
        >
          <RefreshCw className={`w-4 h-4 ${refreshMutation.isPending ? 'animate-spin' : ''}`} />
          {refreshMutation.isPending ? "Syncing…" : "Sync Data Now"}
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[200px] w-full rounded-xl" />
          <Skeleton className="h-[200px] w-full rounded-xl" />
          <Skeleton className="h-[300px] w-full rounded-xl md:col-span-2" />
        </div>
      ) : !status || !lastUpdate ? (
        <div className="text-muted-foreground">System status unavailable.</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="w-5 h-5 text-primary" />
                API Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <span className="text-muted-foreground">Core Service</span>
                <Badge variant={status.apiHealth === 'ok' ? 'default' : 'destructive'} className="uppercase">
                  {status.apiHealth === 'ok' ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                  {status.apiHealth}
                </Badge>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <span className="text-muted-foreground">Sync Mode</span>
                <Badge variant="secondary" className="uppercase">Manual Only</Badge>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-muted-foreground">Auto-Scheduler</span>
                <Badge variant="outline" className="uppercase text-muted-foreground">Disabled</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Database className="w-5 h-5 text-primary" />
                Local Datastore
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                  <div className="text-sm text-muted-foreground mb-1">Satellites</div>
                  <div className="text-2xl font-bold font-mono text-primary">{lastUpdate.satelliteCount.toLocaleString()}</div>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                  <div className="text-sm text-muted-foreground mb-1">Debris</div>
                  <div className="text-2xl font-bold font-mono">{lastUpdate.debrisCount.toLocaleString()}</div>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                  <div className="text-sm text-muted-foreground mb-1">Rocket Bodies</div>
                  <div className="text-2xl font-bold font-mono">{lastUpdate.rocketBodyCount.toLocaleString()}</div>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                  <div className="text-sm text-muted-foreground mb-1">Total Records</div>
                  <div className="text-2xl font-bold font-mono text-muted-foreground">
                    {(lastUpdate.satelliteCount + lastUpdate.debrisCount + lastUpdate.rocketBodyCount).toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Server className="w-5 h-5 text-primary" />
                Upstream Data Sources (CelesTrak)
              </CardTitle>
              <CardDescription>Connection status to external TLE providers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(status.dataSourceStatus).map(([source, sourceStatus]) => (
                  <div key={source} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-muted/20 border border-border rounded-lg">
                    <div className="flex items-center gap-3 mb-2 sm:mb-0">
                      <div className={`w-2 h-2 rounded-full ${sourceStatus === 'connected' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]' : 'bg-red-500'}`} />
                      <span className="font-medium font-mono">{source}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <Badge variant="outline" className={sourceStatus === 'connected' ? 'text-green-500 border-green-500/30' : 'text-red-500 border-red-500/30'}>
                        {sourceStatus}
                      </Badge>
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        Last Sync: {status.lastRefresh ? new Date(status.lastRefresh).toLocaleString() : 'Never'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      )}
    </div>
  );
}