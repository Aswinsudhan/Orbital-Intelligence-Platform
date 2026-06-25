import { Router } from "express";
import { logger } from "../lib/logger";

const router = Router();

const LL2_BASE = "https://ll.thespacedevs.com/2.2.0";
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

interface CacheEntry {
  data: unknown;
  fetchedAt: number;
}

const cache = new Map<string, CacheEntry>();

async function fetchLL2(path: string): Promise<unknown> {
  const cached = cache.get(path);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return cached.data;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const resp = await fetch(`${LL2_BASE}${path}`, {
      signal: controller.signal,
      headers: { "Accept": "application/json", "User-Agent": "OrbitalIntelligencePlatform/1.0" },
    });
    clearTimeout(timer);
    if (!resp.ok) throw new Error(`LL2 API error: ${resp.status}`);
    const data = await resp.json();
    cache.set(path, { data, fetchedAt: Date.now() });
    return data;
  } catch (err) {
    clearTimeout(timer);
    logger.warn({ path, err }, "Failed to fetch from Launch Library 2");
    if (cached) return cached.data; // return stale on error
    throw err;
  }
}

interface LL2Launch {
  id: string;
  name: string;
  status: { name: string; abbrev: string };
  net: string;
  launch_service_provider: { name: string; type: string };
  rocket: { configuration: { name: string; full_name: string; family: string } };
  mission: {
    name: string;
    description: string;
    type: string;
    orbit: { name: string; abbrev: string } | null;
  } | null;
  pad: {
    name: string;
    location: { name: string; country_code: string };
  };
  image: string | null;
  webcast_live: boolean;
  program: { name: string; image_url: string | null }[];
}

function shapeLaunch(l: LL2Launch) {
  return {
    id: l.id,
    name: l.name,
    status: l.status.name,
    statusAbbrev: l.status.abbrev,
    launchTime: l.net,
    provider: l.launch_service_provider.name,
    providerType: l.launch_service_provider.type,
    rocket: l.rocket.configuration.full_name || l.rocket.configuration.name,
    rocketFamily: l.rocket.configuration.family,
    missionName: l.mission?.name ?? l.name,
    missionType: l.mission?.type ?? "Unknown",
    missionDescription: l.mission?.description ?? "",
    orbit: l.mission?.orbit?.name ?? null,
    orbitAbbrev: l.mission?.orbit?.abbrev ?? null,
    padName: l.pad.name,
    location: l.pad.location.name,
    countryCode: l.pad.location.country_code,
    image: l.image,
    webcastLive: l.webcast_live,
    program: l.program?.[0]?.name ?? null,
  };
}

router.get("/upcoming", async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 20, 50);
    const data = await fetchLL2(`/launch/upcoming/?limit=${limit}&format=json`) as { results: LL2Launch[]; count: number };
    res.json({ total: data.count, results: data.results.map(shapeLaunch) });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch upcoming launches");
    res.status(502).json({ error: "Failed to fetch launch data" });
  }
});

router.get("/recent", async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 20, 50);
    const data = await fetchLL2(`/launch/previous/?limit=${limit}&format=json`) as { results: LL2Launch[]; count: number };
    res.json({ total: data.count, results: data.results.map(shapeLaunch) });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch recent launches");
    res.status(502).json({ error: "Failed to fetch launch data" });
  }
});

export default router;
