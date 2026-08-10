import { Router } from "express";
import { logger } from "../lib/logger";

const router = Router();

const LL2_BASE = "https://ll.thespacedevs.com/2.2.0";
const CACHE_TTL_MS = 60 * 60 * 1000; // 60 minutes cache

interface CacheEntry {
  data: unknown;
  fetchedAt: number;
}

const cache = new Map<string, CacheEntry>();

const FALLBACK_UPCOMING = [
  {
    id: "fb-up-1",
    name: "Falcon 9 Block 5 | Starlink Group 10-1",
    status: "Go for Launch",
    statusAbbrev: "Go",
    launchTime: new Date(Date.now() + 86400000).toISOString(),
    provider: "SpaceX",
    providerType: "Commercial",
    rocket: "Falcon 9 Block 5",
    rocketFamily: "Falcon",
    missionName: "Starlink Group 10-1",
    missionType: "Communications",
    missionDescription: "Batch of Starlink satellites for internet constellation.",
    orbit: "Low Earth Orbit",
    orbitAbbrev: "LEO",
    padName: "SLC-40",
    location: "Cape Canaveral SFS, FL, USA",
    countryCode: "USA",
    image: "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/falcon252092520launch_image_20240325124119.jpeg",
    webcastLive: false,
    program: "Starlink",
  },
  {
    id: "fb-up-2",
    name: "Falcon Heavy | Europa Clipper",
    status: "Go for Launch",
    statusAbbrev: "Go",
    launchTime: new Date(Date.now() + 3 * 86400000).toISOString(),
    provider: "SpaceX",
    providerType: "Commercial",
    rocket: "Falcon Heavy",
    rocketFamily: "Falcon",
    missionName: "Europa Clipper Mission",
    missionType: "Planetary Science",
    missionDescription: "NASA mission to investigate Jupiter's icy moon Europa.",
    orbit: "Heliocentric Orbit",
    orbitAbbrev: "HCO",
    padName: "LC-39A",
    location: "Kennedy Space Center, FL, USA",
    countryCode: "USA",
    image: null,
    webcastLive: true,
    program: "NASA Planetary",
  },
  {
    id: "fb-up-3",
    name: "Ariane 6 | VA262 Demonstration Flight",
    status: "Go for Launch",
    statusAbbrev: "Go",
    launchTime: new Date(Date.now() + 5 * 86400000).toISOString(),
    provider: "Arianespace",
    providerType: "Commercial",
    rocket: "Ariane 62",
    rocketFamily: "Ariane",
    missionName: "Ariane 6 Maiden Flight",
    missionType: "Test Flight",
    missionDescription: "Inaugural launch of ESA's new heavy-lift Ariane 6 launch vehicle.",
    orbit: "Low Earth Orbit",
    orbitAbbrev: "LEO",
    padName: "ELA-4",
    location: "Guiana Space Centre, French Guiana",
    countryCode: "GUF",
    image: null,
    webcastLive: true,
    program: "ESA Heavy Lift",
  },
  {
    id: "fb-up-4",
    name: "SLS Block 1 | Artemis II",
    status: "To Be Determined",
    statusAbbrev: "TBD",
    launchTime: new Date(Date.now() + 30 * 86400000).toISOString(),
    provider: "NASA",
    providerType: "Government",
    rocket: "Space Launch System (SLS)",
    rocketFamily: "SLS",
    missionName: "Artemis II Crewed Lunar Flyby",
    missionType: "Human Exploration",
    missionDescription: "First crewed flight test of the Orion spacecraft around the Moon.",
    orbit: "Lunar Free Return",
    orbitAbbrev: "TLI",
    padName: "LC-39B",
    location: "Kennedy Space Center, FL, USA",
    countryCode: "USA",
    image: null,
    webcastLive: false,
    program: "Artemis",
  },
];

const FALLBACK_RECENT = [
  {
    id: "fb-rec-1",
    name: "Electron | Owl Night Long",
    status: "Launch Successful",
    statusAbbrev: "Success",
    launchTime: new Date(Date.now() - 2 * 86400000).toISOString(),
    provider: "Rocket Lab",
    providerType: "Commercial",
    rocket: "Electron",
    rocketFamily: "Electron",
    missionName: "StriX Synthetic Aperture Radar",
    missionType: "Earth Observation",
    missionDescription: "Dedicated mission for Synspective's SAR constellation.",
    orbit: "Sun-Synchronous Orbit",
    orbitAbbrev: "SSO",
    padName: "Launch Complex 1A",
    location: "Mahia Peninsula, New Zealand",
    countryCode: "NZL",
    image: null,
    webcastLive: false,
    program: "Synspective",
  },
  {
    id: "fb-rec-2",
    name: "Vulcan Centaur | CERT-1",
    status: "Launch Successful",
    statusAbbrev: "Success",
    launchTime: new Date(Date.now() - 7 * 86400000).toISOString(),
    provider: "United Launch Alliance (ULA)",
    providerType: "Commercial",
    rocket: "Vulcan Centaur",
    rocketFamily: "Vulcan",
    missionName: "Peregrine Mission 1 & Kuiper Prototypes",
    missionType: "Lunar Lander",
    missionDescription: "Inaugural flight of ULA Vulcan rocket delivering Peregrine lander.",
    orbit: "Trans-Lunar Injection",
    orbitAbbrev: "TLI",
    padName: "SLC-41",
    location: "Cape Canaveral SFS, FL, USA",
    countryCode: "USA",
    image: null,
    webcastLive: false,
    program: "CLPS",
  },
];

async function fetchLL2(path: string): Promise<unknown> {
  const cached = cache.get(path);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return cached.data;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const resp = await fetch(`${LL2_BASE}${path}`, {
      signal: controller.signal,
      headers: {
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      },
    });
    clearTimeout(timer);
    if (!resp.ok) throw new Error(`LL2 API error: ${resp.status}`);
    const data = await resp.json();
    cache.set(path, { data, fetchedAt: Date.now() });
    return data;
  } catch (err) {
    clearTimeout(timer);
    logger.warn({ path, err }, "Failed to fetch from Launch Library 2, returning cache or fallback");
    if (cached) return cached.data;
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
    req.log.warn({ err }, "Using fallback upcoming launch dataset");
    res.json({ total: FALLBACK_UPCOMING.length, results: FALLBACK_UPCOMING });
  }
});

router.get("/recent", async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 20, 50);
    const data = await fetchLL2(`/launch/previous/?limit=${limit}&format=json`) as { results: LL2Launch[]; count: number };
    res.json({ total: data.count, results: data.results.map(shapeLaunch) });
  } catch (err) {
    req.log.warn({ err }, "Using fallback recent launch dataset");
    res.json({ total: FALLBACK_RECENT.length, results: FALLBACK_RECENT });
  }
});

export default router;
