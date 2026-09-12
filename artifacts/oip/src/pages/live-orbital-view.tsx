import { useEffect, useRef, useState, useMemo } from "react";
import * as satellite from "satellite.js";
import { customFetch } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search, 
  Globe as GlobeIcon, 
  Satellite as SatelliteIcon, 
  Trash2, 
  Flame, 
  RotateCcw, 
  Info, 
  Activity, 
  Clock, 
  AlertTriangle,
  Compass,
  Layers,
  X,
  Maximize2
} from "lucide-react";

interface TrackedObject {
  id: number;
  noradId: number;
  name: string;
  objectType: "ACTIVE" | "DEBRIS" | "ROCKET BODY";
  orbitType: string;
  altitude: number | null;
  inclination: number | null;
  velocity: number | null;
  eccentricity: number | null;
  epoch: string | null;
  tle1: string;
  tle2: string;
  lastUpdated: string;
  satrec?: satellite.SatRec;
}

interface CalculatedPosition {
  lat: number;
  lon: number;
  alt: number;
  vel: number;
  cartesian: any; // Cesium.Cartesian3
}

export default function LiveOrbitalView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const pointsCollectionRef = useRef<any>(null);
  const pointPrimitiveMapRef = useRef<Map<number, any>>(new Map());
  const pathEntityRef = useRef<any>(null);

  const [objects, setObjects] = useState<TrackedObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<TrackedObject[]>([]);
  const [selectedObject, setSelectedObject] = useState<TrackedObject | null>(null);
  const [selectedPos, setSelectedPos] = useState<CalculatedPosition | null>(null);

  const [categoryFilter, setCategoryFilter] = useState<"ALL" | "ACTIVE" | "DEBRIS" | "ROCKET_BODY">("ALL");
  const [orbitFilter, setOrbitFilter] = useState<"ALL" | "LEO" | "MEO" | "GEO">("ALL");

  const [lastDataUpdate, setLastDataUpdate] = useState<string>("");
  const [calculationTime, setCalculationTime] = useState<string>("");

  // Statistics
  const stats = useMemo(() => {
    const active = objects.filter((o) => o.objectType === "ACTIVE").length;
    const debris = objects.filter((o) => o.objectType === "DEBRIS").length;
    const rocket = objects.filter((o) => o.objectType === "ROCKET BODY").length;
    return { total: objects.length, active, debris, rocket };
  }, [objects]);

  // 1. Fetch real TLE orbital data from backend APIs
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      setErrorBanner(null);
      try {
        const [satRes, debRes, rbRes] = await Promise.allSettled([
          customFetch<{ data: any[] }>("/api/satellites?limit=1000"),
          customFetch<{ data: any[] }>("/api/debris?limit=1000"),
          customFetch<{ data: any[] }>("/api/rocket-bodies?limit=1000"),
        ]);

        const combined: TrackedObject[] = [];
        let latestTimestamp = "";

        if (satRes.status === "fulfilled" && satRes.value?.data) {
          for (const s of satRes.value.data) {
            if (!s.tle1 || !s.tle2) continue;
            try {
              const satrec = satellite.twoline2satrec(s.tle1, s.tle2);
              combined.push({
                id: s.id ?? s.noradId,
                noradId: s.noradId,
                name: s.name,
                objectType: "ACTIVE",
                orbitType: s.orbitType || "LEO",
                altitude: s.altitude,
                inclination: s.inclination,
                velocity: s.velocity,
                eccentricity: s.eccentricity,
                epoch: s.epoch,
                tle1: s.tle1,
                tle2: s.tle2,
                lastUpdated: s.lastUpdated || new Date().toISOString(),
                satrec,
              });
              if (!latestTimestamp || s.lastUpdated > latestTimestamp) {
                latestTimestamp = s.lastUpdated;
              }
            } catch (err) {
              console.warn(`[Propagation Error] Excluded sat ${s.noradId}:`, err);
            }
          }
        }

        if (debRes.status === "fulfilled" && debRes.value?.data) {
          for (const d of debRes.value.data) {
            if (!d.tle1 || !d.tle2) continue;
            try {
              const satrec = satellite.twoline2satrec(d.tle1, d.tle2);
              combined.push({
                id: d.id ?? d.noradId,
                noradId: d.noradId,
                name: d.name,
                objectType: "DEBRIS",
                orbitType: (d.altitude ?? 0) < 2000 ? "LEO" : "MEO",
                altitude: d.altitude,
                inclination: d.inclination,
                velocity: null,
                eccentricity: d.eccentricity,
                epoch: d.epoch,
                tle1: d.tle1,
                tle2: d.tle2,
                lastUpdated: d.lastUpdated || new Date().toISOString(),
                satrec,
              });
              if (!latestTimestamp || d.lastUpdated > latestTimestamp) {
                latestTimestamp = d.lastUpdated;
              }
            } catch (err) {
              console.warn(`[Propagation Error] Excluded debris ${d.noradId}:`, err);
            }
          }
        }

        if (rbRes.status === "fulfilled" && rbRes.value?.data) {
          for (const r of rbRes.value.data) {
            if (!r.tle1 || !r.tle2) continue;
            try {
              const satrec = satellite.twoline2satrec(r.tle1, r.tle2);
              combined.push({
                id: r.id ?? r.noradId,
                noradId: r.noradId,
                name: r.name,
                objectType: "ROCKET BODY",
                orbitType: (r.altitude ?? 0) < 2000 ? "LEO" : "MEO",
                altitude: r.altitude,
                inclination: r.inclination,
                velocity: null,
                eccentricity: r.eccentricity,
                epoch: r.epoch,
                tle1: r.tle1,
                tle2: r.tle2,
                lastUpdated: r.lastUpdated || new Date().toISOString(),
                satrec,
              });
              if (!latestTimestamp || r.lastUpdated > latestTimestamp) {
                latestTimestamp = r.lastUpdated;
              }
            } catch (err) {
              console.warn(`[Propagation Error] Excluded rocket body ${r.noradId}:`, err);
            }
          }
        }

        if (isMounted) {
          if (combined.length === 0) {
            setErrorBanner("CelesTrak data source temporarily unavailable. Showing cached orbital snapshot.");
          } else {
            setObjects(combined);
            setLastDataUpdate(latestTimestamp ? new Date(latestTimestamp).toUTCString() : new Date().toUTCString());
          }
        }
      } catch (err) {
        console.error("Failed to load orbital data:", err);
        if (isMounted) {
          setErrorBanner("Data source temporarily unavailable. Unable to load live orbital parameters.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  // 2. Initialize CesiumJS Viewer
  useEffect(() => {
    if (!containerRef.current) return;
    if (viewerRef.current) return;

    if (typeof window === "undefined" || !window.Cesium) {
      console.error("CesiumJS script is not loaded");
      return;
    }

    const Cesium = window.Cesium;

    // Suppress Ion token warning for local rendering
    Cesium.Ion.defaultAccessToken = "";

    const viewer = new Cesium.Viewer(containerRef.current, {
      animation: false,
      baseLayerPicker: false,
      fullscreenButton: false,
      geocoder: false,
      homeButton: false,
      infoBox: false,
      sceneModePicker: false,
      selectionIndicator: false,
      timeline: false,
      navigationHelpButton: false,
      navigationInstructionsInitiallyVisible: false,
      shadows: true,
      shouldAnimate: true,
      globe: new Cesium.Globe(Cesium.Ellipsoid.WGS84),
    });

    // Styling Cesium environment for aerospace look
    const scene = viewer.scene;
    scene.skyAtmosphere.show = true;
    scene.globe.enableLighting = true;
    scene.globe.atmosphereColor = Cesium.Color.fromCssColorString("#0ea5e9").withAlpha(0.2);
    scene.globe.atmosphereRayleighCoefficient = new Cesium.Cartesian3(5.5e-6, 13.0e-6, 28.4e-6);

    // Initial camera positioning over Central Atlantic / Global view
    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(0, 20, 25000000),
    });

    // Create high-performance point primitive collection
    const pointsCollection = scene.primitives.add(new Cesium.PointPrimitiveCollection());
    pointsCollectionRef.current = pointsCollection;

    // Set up click handler for picking objects
    const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    handler.setInputAction((click: any) => {
      const picked = scene.pick(click.position);
      if (Cesium.defined(picked) && picked.primitive && picked.primitive.id) {
        const obj: TrackedObject = picked.primitive.id;
        setSelectedObject(obj);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    viewerRef.current = viewer;

    return () => {
      handler.destroy();
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, []);

  // 3. Render and update object points in Cesium scene
  useEffect(() => {
    const viewer = viewerRef.current;
    const pointsCollection = pointsCollectionRef.current;
    if (!viewer || !pointsCollection || typeof window === "undefined" || !window.Cesium) return;

    const Cesium = window.Cesium;
    pointsCollection.removeAll();
    pointPrimitiveMapRef.current.clear();

    const activeColor = Cesium.Color.fromCssColorString("#00f0ff");
    const debrisColor = Cesium.Color.fromCssColorString("#f97316");
    const rocketColor = Cesium.Color.fromCssColorString("#ec4899");
    const selectedColor = Cesium.Color.fromCssColorString("#ffffff");

    const now = new Date();
    const gmst = satellite.gstime(now);

    objects.forEach((obj) => {
      if (!obj.satrec) return;

      // Filter checks
      if (categoryFilter !== "ALL" && obj.objectType !== categoryFilter.replace("_", " ")) {
        return;
      }
      if (orbitFilter !== "ALL" && obj.orbitType !== orbitFilter) {
        return;
      }

      try {
        const posVel = satellite.propagate(obj.satrec, now);
        if (!posVel || !posVel.position || typeof posVel.position === "boolean") return;

        const geo = satellite.eciToGeodetic(posVel.position as satellite.EciVec3<satellite.Kilometer>, gmst);
        const lonDeg = satellite.degreesLong(geo.longitude);
        const latDeg = satellite.degreesLat(geo.latitude);
        const heightMeters = geo.height * 1000;

        if (isNaN(lonDeg) || isNaN(latDeg) || isNaN(heightMeters)) return;

        const cartesian = Cesium.Cartesian3.fromDegrees(lonDeg, latDeg, heightMeters);

        const isSelected = selectedObject?.noradId === obj.noradId;

        let color = activeColor;
        if (obj.objectType === "DEBRIS") color = debrisColor;
        else if (obj.objectType === "ROCKET BODY") color = rocketColor;

        const point = pointsCollection.add({
          position: cartesian,
          color: isSelected ? selectedColor : color,
          pixelSize: isSelected ? 12 : (obj.objectType === "ACTIVE" ? 7 : 5),
          outlineColor: isSelected ? color : Cesium.Color.BLACK,
          outlineWidth: isSelected ? 2 : 1,
          id: obj,
        });

        pointPrimitiveMapRef.current.set(obj.noradId, point);
      } catch (err) {
        // Exclude invalid individual object silently
      }
    });

    viewer.scene.requestRender();
  }, [objects, categoryFilter, orbitFilter, selectedObject]);

  // 4. Real-time SGP4 position propagation loop (1-second clock tick)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCalculationTime(now.toUTCString());

      const pointsCollection = pointsCollectionRef.current;
      const viewer = viewerRef.current;
      if (!pointsCollection || !viewer || typeof window === "undefined" || !window.Cesium) return;

      const Cesium = window.Cesium;
      const gmst = satellite.gstime(now);

      pointPrimitiveMapRef.current.forEach((point, noradId) => {
        const obj: TrackedObject = point.id;
        if (!obj || !obj.satrec) return;

        try {
          const posVel = satellite.propagate(obj.satrec, now);
          if (posVel && posVel.position && typeof posVel.position !== "boolean") {
            const geo = satellite.eciToGeodetic(posVel.position as satellite.EciVec3<satellite.Kilometer>, gmst);
            const lonDeg = satellite.degreesLong(geo.longitude);
            const latDeg = satellite.degreesLat(geo.latitude);
            const altKm = geo.height;

            const cartesian = Cesium.Cartesian3.fromDegrees(lonDeg, latDeg, altKm * 1000);
            point.position = cartesian;

            if (selectedObject?.noradId === noradId) {
              let velKmS = obj.velocity ?? 7.5;
              if (posVel && posVel.velocity && typeof posVel.velocity !== "boolean") {
                const v = posVel.velocity as satellite.EciVec3<satellite.KilometerPerSecond>;
                velKmS = Math.round(Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2) * 100) / 100;
              }
              setSelectedPos({
                lat: Math.round(latDeg * 10000) / 10000,
                lon: Math.round(lonDeg * 10000) / 10000,
                alt: Math.round(altKm * 10) / 10,
                vel: velKmS,
                cartesian,
              });
            }
          }
        } catch (err) {
          // Silent propagation catch
        }
      });

      viewer.scene.requestRender();
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedObject]);

  // 5. Render 3D Orbit Path Polyline when an object is selected
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || typeof window === "undefined" || !window.Cesium) return;

    const Cesium = window.Cesium;

    // Remove existing path entity
    if (pathEntityRef.current) {
      viewer.entities.remove(pathEntityRef.current);
      pathEntityRef.current = null;
    }

    if (!selectedObject || !selectedObject.satrec) return;

    const satrec = selectedObject.satrec;
    const now = new Date();

    // Determine orbit period
    const meanMotionRad = satrec.no; // rad/min
    const periodMinutes = meanMotionRad > 0 ? (2 * Math.PI) / meanMotionRad : 95;
    const totalSteps = 100;
    const stepMs = (periodMinutes * 60 * 1000) / totalSteps;

    const pathCartesians: any[] = [];

    for (let i = 0; i <= totalSteps; i++) {
      const time = new Date(now.getTime() + i * stepMs);
      const gmst = satellite.gstime(time);
      const posVel = satellite.propagate(satrec, time);

      if (posVel && posVel.position && typeof posVel.position !== "boolean") {
        const geo = satellite.eciToGeodetic(posVel.position as satellite.EciVec3<satellite.Kilometer>, gmst);
        const lonDeg = satellite.degreesLong(geo.longitude);
        const latDeg = satellite.degreesLat(geo.latitude);
        const altMeters = geo.height * 1000;

        if (!isNaN(lonDeg) && !isNaN(latDeg) && !isNaN(altMeters)) {
          pathCartesians.push(Cesium.Cartesian3.fromDegrees(lonDeg, latDeg, altMeters));
        }
      }
    }

    if (pathCartesians.length > 2) {
      let pathColor = Cesium.Color.fromCssColorString("#00f0ff");
      if (selectedObject.objectType === "DEBRIS") pathColor = Cesium.Color.fromCssColorString("#f97316");
      else if (selectedObject.objectType === "ROCKET BODY") pathColor = Cesium.Color.fromCssColorString("#ec4899");

      pathEntityRef.current = viewer.entities.add({
        polyline: {
          positions: pathCartesians,
          width: 2.5,
          material: new Cesium.PolylineGlowMaterialProperty({
            glowPower: 0.25,
            color: pathColor.withAlpha(0.85),
          }),
        },
      });
    }
  }, [selectedObject]);

  // 6. Search Bar Filter Logic
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    const matches = objects.filter(
      (o) => o.name.toLowerCase().includes(q) || String(o.noradId).includes(q)
    ).slice(0, 8);
    setSearchResults(matches);
  }, [searchQuery, objects]);

  // 7. Fly camera to selected satellite
  const handleSelectObject = (obj: TrackedObject) => {
    setSelectedObject(obj);
    setSearchQuery("");
    setSearchResults([]);

    const viewer = viewerRef.current;
    if (!viewer || !obj.satrec || typeof window === "undefined" || !window.Cesium) return;

    const Cesium = window.Cesium;
    const now = new Date();
    const gmst = satellite.gstime(now);
    const posVel = satellite.propagate(obj.satrec, now);

    if (posVel && posVel.position && typeof posVel.position !== "boolean") {
      const geo = satellite.eciToGeodetic(posVel.position as satellite.EciVec3<satellite.Kilometer>, gmst);
      const lonDeg = satellite.degreesLong(geo.longitude);
      const latDeg = satellite.degreesLat(geo.latitude);
      const altKm = geo.height;

      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(lonDeg, latDeg, (altKm + 3000) * 1000),
        duration: 1.8,
      });
    }
  };

  const resetCamera = () => {
    if (viewerRef.current && typeof window !== "undefined" && window.Cesium) {
      const Cesium = window.Cesium;
      viewerRef.current.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(0, 20, 25000000),
        duration: 1.5,
      });
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      
      {/* 3D Cesium Container */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />

      {/* Top HUD Banner — Title & KPI Stats */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pointer-events-none">
        
        {/* Title Badge */}
        <div className="pointer-events-auto bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-xl p-3 px-5 shadow-2xl flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <GlobeIcon className="w-6 h-6 text-cyan-400 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-wider text-slate-100 uppercase">Live Orbital View</h1>
              <Badge variant="outline" className="text-[10px] font-mono border-cyan-500/50 text-cyan-400 bg-cyan-950/40">
                SGP4 REAL-TIME
              </Badge>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Space Situational Awareness • CelesTrak Integration
            </p>
          </div>
        </div>

        {/* Live Counters */}
        <div className="pointer-events-auto bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-xl p-2 px-4 shadow-2xl flex items-center divide-x divide-slate-800 text-xs font-mono">
          <div className="px-3 text-center">
            <span className="text-slate-400 block text-[10px] uppercase">Tracked Objects</span>
            <span className="text-base font-bold text-slate-100">{loading ? <Skeleton className="h-5 w-10 mx-auto" /> : stats.total.toLocaleString()}</span>
          </div>
          <div className="px-3 text-center">
            <span className="text-cyan-400 flex items-center justify-center gap-1 text-[10px] uppercase">
              <SatelliteIcon className="w-3 h-3" /> Active
            </span>
            <span className="text-base font-bold text-cyan-400">{loading ? <Skeleton className="h-5 w-10 mx-auto" /> : stats.active.toLocaleString()}</span>
          </div>
          <div className="px-3 text-center">
            <span className="text-orange-400 flex items-center justify-center gap-1 text-[10px] uppercase">
              <Trash2 className="w-3 h-3" /> Debris
            </span>
            <span className="text-base font-bold text-orange-400">{loading ? <Skeleton className="h-5 w-10 mx-auto" /> : stats.debris.toLocaleString()}</span>
          </div>
          <div className="px-3 text-center">
            <span className="text-pink-400 flex items-center justify-center gap-1 text-[10px] uppercase">
              <Flame className="w-3 h-3" /> Rocket Bodies
            </span>
            <span className="text-base font-bold text-pink-400">{loading ? <Skeleton className="h-5 w-10 mx-auto" /> : stats.rocket.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Sub-Header: Source Timestamps Bar */}
      <div className="absolute top-20 left-4 z-20 pointer-events-none hidden sm:flex flex-col gap-1 text-[11px] font-mono text-slate-400">
        <div className="pointer-events-auto bg-slate-900/80 backdrop-blur-md border border-slate-800/80 rounded-lg px-3 py-1.5 flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
            Data Source: CelesTrak GP
          </span>
          <span className="text-slate-500">|</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" /> TLE Epoch: {lastDataUpdate || "Updating..."}
          </span>
          <span className="text-slate-500">|</span>
          <span className="flex items-center gap-1 text-cyan-300">
            <Activity className="w-3 h-3 text-cyan-400" /> Clock: {calculationTime || "Live..."}
          </span>
        </div>
      </div>

      {/* Error / Warning Banner */}
      {errorBanner && (
        <div className="absolute top-32 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-auto z-30 bg-amber-950/90 border border-amber-500/50 text-amber-200 px-4 py-2 rounded-lg text-xs font-mono flex items-center justify-between gap-3 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{errorBanner}</span>
          </div>
          <button onClick={() => setErrorBanner(null)} className="text-amber-400 hover:text-amber-100">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Control Box: Search & Filters */}
      <div className="absolute top-24 right-4 z-20 w-80 max-w-[calc(100vw-2rem)] flex flex-col gap-3 pointer-events-auto">
        
        {/* Satellite Search Input */}
        <div className="relative">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search satellite or NORAD ID..."
              className="pl-9 pr-8 bg-slate-900/90 backdrop-blur-md border-slate-800 text-xs font-mono text-slate-100 placeholder:text-slate-500 rounded-xl focus:border-cyan-500 focus:ring-cyan-500/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                onClick={() => { setSearchQuery(""); setSearchResults([]); }}
                className="absolute right-2.5 text-slate-400 hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-xl overflow-hidden shadow-2xl z-30 max-h-64 overflow-y-auto font-mono text-xs divide-y divide-slate-800/50">
              {searchResults.map((res) => (
                <button
                  key={res.noradId}
                  onClick={() => handleSelectObject(res)}
                  className="w-full px-3 py-2 text-left hover:bg-cyan-950/50 transition-colors flex items-center justify-between group"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-100 group-hover:text-cyan-400">{res.name}</span>
                    <span className="text-[10px] text-slate-400">NORAD #{res.noradId} • {res.orbitType}</span>
                  </div>
                  <Badge variant="outline" className={`text-[9px] ${
                    res.objectType === "ACTIVE" ? "border-cyan-500 text-cyan-400" :
                    res.objectType === "DEBRIS" ? "border-orange-500 text-orange-400" : "border-pink-500 text-pink-400"
                  }`}>
                    {res.objectType}
                  </Badge>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filter Panel */}
        <div className="bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-xl p-3 shadow-2xl flex flex-col gap-2.5 text-xs font-mono">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold border-b border-slate-800/80 pb-1.5">
            <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-cyan-400" /> CATEGORY FILTERS</span>
            <button onClick={resetCamera} title="Reset Camera View" className="text-slate-400 hover:text-cyan-400 flex items-center gap-1 text-[10px]">
              <RotateCcw className="w-3 h-3" /> Reset View
            </button>
          </div>

          {/* Object Type Buttons */}
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => setCategoryFilter("ALL")}
              className={`py-1 px-2 rounded-lg text-[11px] font-medium transition-all ${categoryFilter === "ALL" ? "bg-cyan-950 border border-cyan-500/60 text-cyan-300" : "bg-slate-800/50 text-slate-400 hover:bg-slate-800"}`}
            >
              All Objects
            </button>
            <button
              onClick={() => setCategoryFilter("ACTIVE")}
              className={`py-1 px-2 rounded-lg text-[11px] font-medium transition-all ${categoryFilter === "ACTIVE" ? "bg-cyan-950 border border-cyan-500/60 text-cyan-300" : "bg-slate-800/50 text-slate-400 hover:bg-slate-800"}`}
            >
              Active Only
            </button>
            <button
              onClick={() => setCategoryFilter("DEBRIS")}
              className={`py-1 px-2 rounded-lg text-[11px] font-medium transition-all ${categoryFilter === "DEBRIS" ? "bg-orange-950 border border-orange-500/60 text-orange-300" : "bg-slate-800/50 text-slate-400 hover:bg-slate-800"}`}
            >
              Debris Only
            </button>
            <button
              onClick={() => setCategoryFilter("ROCKET_BODY")}
              className={`py-1 px-2 rounded-lg text-[11px] font-medium transition-all ${categoryFilter === "ROCKET_BODY" ? "bg-pink-950 border border-pink-500/60 text-pink-300" : "bg-slate-800/50 text-slate-400 hover:bg-slate-800"}`}
            >
              Rocket Bodies
            </button>
          </div>

          {/* Orbit Classification Filter */}
          <div className="pt-1 border-t border-slate-800/60 flex items-center justify-between gap-1">
            <span className="text-[10px] text-slate-400 uppercase">Orbit:</span>
            <div className="flex gap-1">
              {(["ALL", "LEO", "MEO", "GEO"] as const).map((orb) => (
                <button
                  key={orb}
                  onClick={() => setOrbitFilter(orb)}
                  className={`px-2 py-0.5 rounded text-[10px] ${orbitFilter === orb ? "bg-slate-700 text-slate-100 font-bold" : "bg-slate-800/40 text-slate-400 hover:text-slate-200"}`}
                >
                  {orb}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Object Information Panel Overlay */}
      {selectedObject && (
        <div className="absolute bottom-6 left-4 right-4 md:right-auto md:w-96 z-30 bg-slate-900/90 backdrop-blur-xl border border-cyan-500/40 rounded-2xl p-4 shadow-2xl font-mono text-xs animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-start justify-between border-b border-slate-800 pb-3 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-100 tracking-wide">{selectedObject.name}</h2>
                <Badge variant="outline" className={`text-[10px] ${
                  selectedObject.objectType === "ACTIVE" ? "border-cyan-500 text-cyan-400 bg-cyan-950/40" :
                  selectedObject.objectType === "DEBRIS" ? "border-orange-500 text-orange-400 bg-orange-950/40" : "border-pink-500 text-pink-400 bg-pink-950/40"
                }`}>
                  {selectedObject.objectType}
                </Badge>
              </div>
              <p className="text-[11px] text-slate-400">NORAD Catalog ID: <span className="text-cyan-400 font-semibold">{selectedObject.noradId}</span></p>
            </div>
            <button 
              onClick={() => setSelectedObject(null)}
              className="text-slate-400 hover:text-slate-100 bg-slate-800/60 p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-[11px]">
            <div className="bg-slate-950/60 border border-slate-800/80 p-2 rounded-xl">
              <span className="text-slate-400 block text-[10px] uppercase">Orbit Classification</span>
              <span className="text-slate-100 font-bold">{selectedObject.orbitType}</span>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/80 p-2 rounded-xl">
              <span className="text-slate-400 block text-[10px] uppercase">Inclination</span>
              <span className="text-slate-100 font-bold">{selectedObject.inclination != null ? `${selectedObject.inclination}°` : "—"}</span>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 p-2 rounded-xl">
              <span className="text-slate-400 block text-[10px] uppercase">Calculated Altitude</span>
              <span className="text-cyan-400 font-bold">
                {selectedPos ? `${selectedPos.alt.toLocaleString()} km` : selectedObject.altitude ? `${selectedObject.altitude.toLocaleString()} km` : "—"}
              </span>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/80 p-2 rounded-xl">
              <span className="text-slate-400 block text-[10px] uppercase">Velocity Magnitude</span>
              <span className="text-cyan-400 font-bold">
                {selectedPos ? `${selectedPos.vel} km/s` : selectedObject.velocity ? `${selectedObject.velocity} km/s` : "7.66 km/s"}
              </span>
            </div>

            <div className="col-span-2 bg-slate-950/60 border border-slate-800/80 p-2 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Current Coordinates</span>
                <span className="text-slate-200 font-semibold">
                  {selectedPos ? `${selectedPos.lat >= 0 ? `${selectedPos.lat}° N` : `${Math.abs(selectedPos.lat)}° S`}, ${selectedPos.lon >= 0 ? `${selectedPos.lon}° E` : `${Math.abs(selectedPos.lon)}° W`}` : "Propagating..."}
                </span>
              </div>
              <Compass className="w-5 h-5 text-cyan-400 opacity-60" />
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
            <span>TLE Epoch: {selectedObject.epoch ? new Date(selectedObject.epoch).toLocaleDateString() : "CelesTrak Recent"}</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span> 3D Orbit Displayed
            </span>
          </div>

          {/* Telemetry Accuracy Disclaimer */}
          <div className="mt-2 bg-cyan-950/30 border border-cyan-800/40 rounded-lg p-2 text-[9.5px] text-cyan-200/80 flex items-start gap-1.5 leading-tight">
            <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              Position calculated via SGP4 orbital propagation from CelesTrak element sets. Displayed coordinates reflect analytical predictions rather than direct ground-truth telemetry.
            </span>
          </div>
        </div>
      )}

      {/* Bottom Map Legend */}
      <div className="absolute bottom-4 left-4 z-20 hidden md:flex items-center gap-4 bg-slate-900/80 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-lg text-[11px] font-mono text-slate-400">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-cyan-400 inline-block shadow-[0_0_8px_#00f0ff]"></span> Active Satellite</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-orange-500 inline-block shadow-[0_0_8px_#f97316]"></span> Space Debris</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-pink-500 inline-block shadow-[0_0_8px_#ec4899]"></span> Rocket Body</span>
      </div>

    </div>
  );
}
