import { useState } from "react";
import { useListDebris, getListDebrisQueryKey, ListDebrisType } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Debris & Rocket Bodies</h1>
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
          <Select value={type} onValueChange={(v) => { setType(v as ListDebrisType); setPage(1); }}>
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="debris">Debris</SelectItem>
              <SelectItem value="rocket_body">Rocket Body</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-xl border border-border overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">NORAD ID</TableHead>
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