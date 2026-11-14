import { useState } from "react";
import { useListDebris, getListDebrisQueryKey, ListDebrisType } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";

export default function Debris() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [type, setType] = useState<ListDebrisType>(ListDebrisType.all);

  const limit = 20;

  const { data, isLoading } = useListDebris(
    { 
      search: search || undefined, 
      type: type !== "all" ? type : undefined, 
      page, 
      limit 
    },
    { 
      query: { 
        queryKey: getListDebrisQueryKey({ search: search || undefined, type: type !== "all" ? type : undefined, page, limit }) 
      } 
    }
  );

  return (
    <div className="space-y-6 w-full max-w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Debris & Rocket Bodies</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Non-functional orbital objects, discarded stages, and debris fragments</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 bg-card p-3 sm:p-4 rounded-xl border border-border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name or NORAD ID..." 
            className="pl-9 font-mono text-sm h-11"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="w-full sm:w-[200px]">
          <Select value={type} onValueChange={(v) => { setType(v as ListDebrisType); setPage(1); }}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="debris">Debris Only</SelectItem>
              <SelectItem value="rocket_body">Rocket Bodies Only</SelectItem>
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
              <div className="flex justify-between items-start mb-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-4 w-24 mb-3" />
              <div className="grid grid-cols-2 gap-2">
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            </Card>
          ))
        ) : !data || data.data.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-card rounded-xl border border-border">
            No objects found.
          </div>
        ) : (
          data.data.map((obj) => (
            <Card key={obj.id} className="p-4 border border-border hover:border-orange-500/40 transition-colors">
              <div className="flex justify-between items-start gap-2 mb-1.5">
                <div className="min-w-0">
                  <h3 className="font-semibold text-base text-foreground truncate">
                    {obj.name}
                  </h3>
                  <p className="text-xs font-mono text-cyan-400">NORAD #{obj.noradId}</p>
                </div>
                <Badge 
                  variant={obj.objectType === 'DEBRIS' ? 'secondary' : 'outline'} 
                  className={`font-mono text-[10px] shrink-0 ${
                    obj.objectType === 'DEBRIS' 
                      ? 'border-orange-500/50 text-orange-400 bg-orange-950/20' 
                      : 'border-pink-500/50 text-pink-400 bg-pink-950/20'
                  }`}
                >
                  {obj.objectType}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-border/60 text-xs font-mono">
                <div className="bg-muted/40 p-2 rounded-lg">
                  <span className="text-[10px] text-muted-foreground uppercase block">Altitude</span>
                  <span className="font-semibold text-foreground">
                    {obj.altitude != null ? `${obj.altitude.toFixed(1)} km` : "—"}
                  </span>
                </div>
                <div className="bg-muted/40 p-2 rounded-lg">
                  <span className="text-[10px] text-muted-foreground uppercase block">Inclination</span>
                  <span className="font-semibold text-foreground">
                    {obj.inclination != null ? `${obj.inclination.toFixed(2)}°` : "—"}
                  </span>
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
                <TableHead className="w-[120px]">NORAD ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Altitude (km)</TableHead>
                <TableHead>Inclination (°)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(10).fill(0).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  </TableRow>
                ))
              ) : !data || data.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No objects found.
                  </TableCell>
                </TableRow>
              ) : (
                data.data.map((obj) => (
                  <TableRow key={obj.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-mono text-primary font-medium">{obj.noradId}</TableCell>
                    <TableCell className="font-medium text-foreground">{obj.name}</TableCell>
                    <TableCell>
                      <Badge variant={obj.objectType === 'DEBRIS' ? 'secondary' : 'outline'} className="font-mono text-xs">
                        {obj.objectType}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-muted-foreground">
                      {obj.altitude != null ? obj.altitude.toFixed(1) : "—"}
                    </TableCell>
                    <TableCell className="font-mono text-muted-foreground">
                      {obj.inclination != null ? obj.inclination.toFixed(2) : "—"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {data && data.total > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm pt-2">
          <div className="text-muted-foreground font-mono text-center sm:text-left">
            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, data.total)} of {data.total.toLocaleString()} objects
          </div>
          <div className="flex gap-2 w-full sm:w-auto justify-center">
            <Button 
              variant="outline" 
              className="min-h-[44px] flex-1 sm:flex-none px-4"
              disabled={page === 1} 
              onClick={() => setPage(p => p - 1)}
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              className="min-h-[44px] flex-1 sm:flex-none px-4"
              disabled={page * limit >= data.total} 
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
