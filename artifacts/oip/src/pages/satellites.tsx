import { useState } from "react";
import { Link } from "wouter";
import { useListSatellites, getListSatellitesQueryKey, ListSatellitesSortBy, ListSatellitesSortOrder } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, ArrowUpDown, Satellite as SatIcon, ChevronRight } from "lucide-react";

export default function Satellites() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [orbitType, setOrbitType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<ListSatellitesSortBy>(ListSatellitesSortBy.noradId);
  const [sortOrder, setSortOrder] = useState<ListSatellitesSortOrder>(ListSatellitesSortOrder.asc);

  const limit = 20;

  const { data, isLoading } = useListSatellites(
    { 
      search: search || undefined, 
      orbitType: orbitType !== "all" ? orbitType : undefined, 
      sortBy, 
      sortOrder, 
      page, 
      limit 
    },
    { 
      query: { 
        queryKey: getListSatellitesQueryKey({ search: search || undefined, orbitType: orbitType !== "all" ? orbitType : undefined, sortBy, sortOrder, page, limit }) 
      } 
    }
  );

  const toggleSort = (field: ListSatellitesSortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="space-y-6 w-full max-w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Satellite Catalog</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Tracked active spacecraft and operational orbital assets</p>
        </div>
      </div>

      {/* Search and Filters Bar with min 44px touch targets */}
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
          <Select value={orbitType} onValueChange={(v) => { setOrbitType(v); setPage(1); }}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Orbit Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orbits</SelectItem>
              <SelectItem value="LEO">LEO (Low Earth)</SelectItem>
              <SelectItem value="MEO">MEO (Medium Earth)</SelectItem>
              <SelectItem value="GEO">GEO (Geostationary)</SelectItem>
              <SelectItem value="HEO">HEO (High Elliptical)</SelectItem>
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
            No satellites found.
          </div>
        ) : (
          data.data.map((sat) => (
            <Link 
              key={sat.id} 
              href={`/satellites/${sat.id}`}
              className="block active:scale-[0.99] transition-transform"
            >
              <Card className="hover:border-cyan-500/50 transition-colors p-4 relative group">
                <div className="flex justify-between items-start gap-2 mb-1.5">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-base text-foreground group-hover:text-cyan-400 transition-colors truncate">
                      {sat.name}
                    </h3>
                    <p className="text-xs font-mono text-cyan-400">NORAD #{sat.noradId}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Badge variant="outline" className="font-mono text-xs border-cyan-500/40 text-cyan-300">
                      {sat.orbitType}
                    </Badge>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-cyan-400 transition-colors" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-border/60 text-xs font-mono">
                  <div className="bg-muted/40 p-2 rounded-lg">
                    <span className="text-[10px] text-muted-foreground uppercase block">Altitude</span>
                    <span className="font-semibold text-foreground">
                      {sat.altitude != null ? `${sat.altitude.toFixed(1)} km` : "—"}
                    </span>
                  </div>
                  <div className="bg-muted/40 p-2 rounded-lg">
                    <span className="text-[10px] text-muted-foreground uppercase block">Inclination</span>
                    <span className="font-semibold text-foreground">
                      {sat.inclination != null ? `${sat.inclination.toFixed(2)}°` : "—"}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
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
                <TableHead className="w-[120px] cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleSort(ListSatellitesSortBy.noradId)}>
                  NORAD ID <ArrowUpDown className="inline h-3 w-3 ml-1" />
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleSort(ListSatellitesSortBy.name)}>
                  Name <ArrowUpDown className="inline h-3 w-3 ml-1" />
                </TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleSort(ListSatellitesSortBy.altitude)}>
                  Altitude (km) <ArrowUpDown className="inline h-3 w-3 ml-1" />
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleSort(ListSatellitesSortBy.inclination)}>
                  Inclination (°) <ArrowUpDown className="inline h-3 w-3 ml-1" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(10).fill(0).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  </TableRow>
                ))
              ) : !data || data.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No satellites found.
                  </TableCell>
                </TableRow>
              ) : (
                data.data.map((sat) => (
                  <TableRow key={sat.id} className="cursor-pointer hover:bg-muted/50 transition-colors group">
                    <TableCell className="font-mono text-primary font-medium group-hover:underline">
                      <Link href={`/satellites/${sat.id}`}>
                        {sat.noradId}
                      </Link>
                    </TableCell>
                    <TableCell className="font-medium text-foreground">{sat.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs">{sat.orbitType}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-muted-foreground">
                      {sat.altitude != null ? sat.altitude.toFixed(1) : "—"}
                    </TableCell>
                    <TableCell className="font-mono text-muted-foreground">
                      {sat.inclination != null ? sat.inclination.toFixed(2) : "—"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination: Responsive layout with touch targets >= 44px */}
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
