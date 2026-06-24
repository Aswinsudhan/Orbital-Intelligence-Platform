import { useState } from "react";
import { Link } from "wouter";
import { useListSatellites, getListSatellitesQueryKey, ListSatellitesSortBy, ListSatellitesSortOrder } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowUpDown } from "lucide-react";

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Satellite Catalog</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-card p-4 rounded-xl border border-border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name or NORAD ID..." 
            className="pl-9 font-mono"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="w-full sm:w-[200px]">
          <Select value={orbitType} onValueChange={(v) => { setOrbitType(v); setPage(1); }}>
            <SelectTrigger>
              <SelectValue placeholder="Orbit Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orbits</SelectItem>
              <SelectItem value="LEO">LEO</SelectItem>
              <SelectItem value="MEO">MEO</SelectItem>
              <SelectItem value="GEO">GEO</SelectItem>
              <SelectItem value="HEO">HEO</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-xl border border-border overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleSort(ListSatellitesSortBy.noradId)}>
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

      {data && data.total > 0 && (
        <div className="flex items-center justify-between text-sm">
          <div className="text-muted-foreground font-mono">
            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, data.total)} of {data.total.toLocaleString()}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={page * limit >= data.total} onClick={() => setPage(p => p + 1)}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}