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

const DEFAULT_ROCKET_IMG = "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=800&q=80";
const STARLINK_IMG = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80";
const NASA_SLS_IMG = "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80";
const ARIANE_IMG = "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?auto=format&fit=crop&w=800&q=80";
const ELECTRON_IMG = "https://images.unsplash.com/photo-1517976547714-720226b864c1?auto=format&fit=crop&w=800&q=80";
const SCIENCE_IMG = "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80";

const FALLBACK_UPCOMING = [
  {
    id: "up-1",
    name: "Falcon 9 Block 5 | Starlink Group 10-1",
    status: "Go for Launch",
    statusAbbrev: "Go",
    launchTime: new Date(Date.now() + 12 * 3600000).toISOString(),
    provider: "SpaceX",
    providerType: "Commercial",
    rocket: "Falcon 9 Block 5",
    rocketFamily: "Falcon",
    missionName: "Starlink Group 10-1",
    missionType: "Communications",
    missionDescription: "Deployment of 23 Starlink v2 Mini broadband satellites to low Earth orbit to expand high-speed connectivity.",
    orbit: "Low Earth Orbit",
    orbitAbbrev: "LEO",
    padName: "SLC-40",
    location: "Cape Canaveral SFS, FL, USA",
    countryCode: "USA",
    image: STARLINK_IMG,
    webcastLive: true,
    program: "Starlink",
  },
  {
    id: "up-2",
    name: "Falcon Heavy | Europa Clipper",
    status: "Go for Launch",
    statusAbbrev: "Go",
    launchTime: new Date(Date.now() + 2 * 86400000).toISOString(),
    provider: "SpaceX",
    providerType: "Commercial",
    rocket: "Falcon Heavy",
    rocketFamily: "Falcon",
    missionName: "Europa Clipper Mission",
    missionType: "Planetary Science",
    missionDescription: "NASA flagship interplanetary mission to conduct detailed reconnaissance of Jupiter's moon Europa and investigate its subsurface ocean.",
    orbit: "Heliocentric Orbit",
    orbitAbbrev: "HCO",
    padName: "LC-39A",
    location: "Kennedy Space Center, FL, USA",
    countryCode: "USA",
    image: SCIENCE_IMG,
    webcastLive: true,
    program: "NASA Planetary",
  },
  {
    id: "up-3",
    name: "Ariane 6 | VA262 Demonstration Flight",
    status: "Go for Launch",
    statusAbbrev: "Go",
    launchTime: new Date(Date.now() + 4 * 86400000).toISOString(),
    provider: "Arianespace",
    providerType: "Commercial",
    rocket: "Ariane 62",
    rocketFamily: "Ariane",
    missionName: "Ariane 6 Maiden Flight",
    missionType: "Test Flight",
    missionDescription: "Inaugural demonstration launch of Europe's next-generation heavy launcher delivering multiple CubeSats into orbit.",
    orbit: "Low Earth Orbit",
    orbitAbbrev: "LEO",
    padName: "ELA-4",
    location: "Guiana Space Centre, Kourou, French Guiana",
    countryCode: "GUF",
    image: ARIANE_IMG,
    webcastLive: true,
    program: "ESA Heavy Lift",
  },
  {
    id: "up-4",
    name: "SLS Block 1 | Artemis II",
    status: "To Be Determined",
    statusAbbrev: "TBD",
    launchTime: new Date(Date.now() + 15 * 86400000).toISOString(),
    provider: "NASA",
    providerType: "Government",
    rocket: "Space Launch System (SLS)",
    rocketFamily: "SLS",
    missionName: "Artemis II Crewed Lunar Flyby",
    missionType: "Human Exploration",
    missionDescription: "First crewed flight test of the Orion spacecraft carrying four astronauts around the Moon and safely returning to Earth.",
    orbit: "Lunar Free Return",
    orbitAbbrev: "TLI",
    padName: "LC-39B",
    location: "Kennedy Space Center, FL, USA",
    countryCode: "USA",
    image: NASA_SLS_IMG,
    webcastLive: false,
    program: "Artemis",
  },
  {
    id: "up-5",
    name: "Vulcan Centaur | USSF-51 National Security",
    status: "Go for Launch",
    statusAbbrev: "Go",
    launchTime: new Date(Date.now() + 7 * 86400000).toISOString(),
    provider: "United Launch Alliance (ULA)",
    providerType: "Commercial",
    rocket: "Vulcan Centaur VC2S",
    rocketFamily: "Vulcan",
    missionName: "USSF-51 Classified Defense Mission",
    missionType: "National Security",
    missionDescription: "Dedicated national security space launch carrying classified payloads for the US Space Force into high orbit.",
    orbit: "Geosynchronous Orbit",
    orbitAbbrev: "GEO",
    padName: "SLC-41",
    location: "Cape Canaveral SFS, FL, USA",
    countryCode: "USA",
    image: DEFAULT_ROCKET_IMG,
    webcastLive: false,
    program: "US Space Force",
  },
  {
    id: "up-6",
    name: "Electron | Owl Night Long",
    status: "Go for Launch",
    statusAbbrev: "Go",
    launchTime: new Date(Date.now() + 9 * 86400000).toISOString(),
    provider: "Rocket Lab",
    providerType: "Commercial",
    rocket: "Electron",
    rocketFamily: "Electron",
    missionName: "StriX-3 Synthetic Aperture Radar",
    missionType: "Earth Observation",
    missionDescription: "Dedicated mission deploying Synspective's high-resolution radar imaging satellite into sun-synchronous orbit.",
    orbit: "Sun-Synchronous Orbit",
    orbitAbbrev: "SSO",
    padName: "Launch Complex 1A",
    location: "Mahia Peninsula, New Zealand",
    countryCode: "NZL",
    image: ELECTRON_IMG,
    webcastLive: true,
    program: "Synspective",
  },
  {
    id: "up-7",
    name: "PSLV-C58 | XPoSat Science Mission",
    status: "Go for Launch",
    statusAbbrev: "Go",
    launchTime: new Date(Date.now() + 11 * 86400000).toISOString(),
    provider: "ISRO",
    providerType: "Government",
    rocket: "PSLV-DL",
    rocketFamily: "PSLV",
    missionName: "X-ray Polarimeter Satellite",
    missionType: "Astrophysics",
    missionDescription: "India's first dedicated polarimetry mission to study X-ray emissions from celestial sources like black holes and neutron stars.",
    orbit: "Low Earth Orbit",
    orbitAbbrev: "LEO",
    padName: "First Launch Pad",
    location: "SDSC SHAR, Sriharikota, India",
    countryCode: "IND",
    image: SCIENCE_IMG,
    webcastLive: true,
    program: "ISRO Science",
  },
  {
    id: "up-8",
    name: "H3-22 | Michibiki 7 (QZS-7)",
    status: "Go for Launch",
    statusAbbrev: "Go",
    launchTime: new Date(Date.now() + 14 * 86400000).toISOString(),
    provider: "Mitsubishi Heavy Industries",
    providerType: "Commercial",
    rocket: "H3-22",
    rocketFamily: "H3",
    missionName: "Quasi-Zenith Satellite 7",
    missionType: "Navigation",
    missionDescription: "Japanese regional satellite navigation augmentation system operating in inclined geosynchronous orbit.",
    orbit: "Geosynchronous Orbit",
    orbitAbbrev: "GEO",
    padName: "LA-Y2",
    location: "Tanegashima Space Center, Japan",
    countryCode: "JPN",
    image: DEFAULT_ROCKET_IMG,
    webcastLive: true,
    program: "QZSS",
  },
  {
    id: "up-9",
    name: "New Glenn | ESCAPADE Mars Spacecraft",
    status: "To Be Determined",
    statusAbbrev: "TBD",
    launchTime: new Date(Date.now() + 25 * 86400000).toISOString(),
    provider: "Blue Origin",
    providerType: "Commercial",
    rocket: "New Glenn",
    rocketFamily: "New Glenn",
    missionName: "NASA ESCAPADE Dual Mars Orbiters",
    missionType: "Planetary Science",
    missionDescription: "Maiden orbital flight of New Glenn launching twin NASA satellites to study Mars' magnetosphere.",
    orbit: "Heliocentric Orbit",
    orbitAbbrev: "HCO",
    padName: "LC-36",
    location: "Cape Canaveral SFS, FL, USA",
    countryCode: "USA",
    image: DEFAULT_ROCKET_IMG,
    webcastLive: false,
    program: "NASA Heliophysics",
  },
  {
    id: "up-10",
    name: "Falcon 9 | Crew-9 ISS Mission",
    status: "Go for Launch",
    statusAbbrev: "Go",
    launchTime: new Date(Date.now() + 18 * 86400000).toISOString(),
    provider: "SpaceX",
    providerType: "Commercial",
    rocket: "Falcon 9 Block 5",
    rocketFamily: "Falcon",
    missionName: "NASA Commercial Crew Crew-9",
    missionType: "Human Spaceflight",
    missionDescription: "Ninth operational crew rotation flight of Dragon spacecraft to the International Space Station.",
    orbit: "Low Earth Orbit",
    orbitAbbrev: "LEO",
    padName: "SLC-40",
    location: "Cape Canaveral SFS, FL, USA",
    countryCode: "USA",
    image: STARLINK_IMG,
    webcastLive: true,
    program: "Commercial Crew",
  },
  {
    id: "up-11",
    name: "Long March 5B | Mengtian Expansion",
    status: "Go for Launch",
    statusAbbrev: "Go",
    launchTime: new Date(Date.now() + 21 * 86400000).toISOString(),
    provider: "CASC",
    providerType: "Government",
    rocket: "Long March 5B",
    rocketFamily: "Long March",
    missionName: "Tiangong Space Station Logistics",
    missionType: "Resupply",
    missionDescription: "Heavy-lift rocket carrying essential hardware and scientific payloads to the Tiangong space station.",
    orbit: "Low Earth Orbit",
    orbitAbbrev: "LEO",
    padName: "LC-101",
    location: "Wenchang Space Launch Site, China",
    countryCode: "CHN",
    image: DEFAULT_ROCKET_IMG,
    webcastLive: false,
    program: "Tiangong",
  },
  {
    id: "up-12",
    name: "Atlas V 551 | Project Kuiper Proto-2",
    status: "Go for Launch",
    statusAbbrev: "Go",
    launchTime: new Date(Date.now() + 28 * 86400000).toISOString(),
    provider: "United Launch Alliance (ULA)",
    providerType: "Commercial",
    rocket: "Atlas V 551",
    rocketFamily: "Atlas",
    missionName: "Amazon Project Kuiper Batch 1",
    missionType: "Communications",
    missionDescription: "Deployment of satellite constellation for Amazon's global broadband network.",
    orbit: "Low Earth Orbit",
    orbitAbbrev: "LEO",
    padName: "SLC-41",
    location: "Cape Canaveral SFS, FL, USA",
    countryCode: "USA",
    image: DEFAULT_ROCKET_IMG,
    webcastLive: true,
    program: "Kuiper",
  },
];

const FALLBACK_RECENT = [
  {
    id: "rec-1",
    name: "Falcon 9 | Starlink Group 6-44",
    status: "Launch Successful",
    statusAbbrev: "Success",
    launchTime: new Date(Date.now() - 1 * 86400000).toISOString(),
    provider: "SpaceX",
    providerType: "Commercial",
    rocket: "Falcon 9 Block 5",
    rocketFamily: "Falcon",
    missionName: "Starlink Constellation Assembly",
    missionType: "Communications",
    missionDescription: "Successfully deployed 23 Starlink satellites into low Earth orbit with booster landing on drone ship.",
    orbit: "Low Earth Orbit",
    orbitAbbrev: "LEO",
    padName: "SLC-40",
    location: "Cape Canaveral SFS, FL, USA",
    countryCode: "USA",
    image: STARLINK_IMG,
    webcastLive: false,
    program: "Starlink",
  },
  {
    id: "rec-2",
    name: "Electron | On the Moon Again",
    status: "Launch Successful",
    statusAbbrev: "Success",
    launchTime: new Date(Date.now() - 3 * 86400000).toISOString(),
    provider: "Rocket Lab",
    providerType: "Commercial",
    rocket: "Electron",
    rocketFamily: "Electron",
    missionName: "CAPSTONE Moon Navigator",
    missionType: "Lunar Pathfinder",
    missionDescription: "Precision insertion of lunar orbiter into near-rectilinear halo orbit for Gateway testing.",
    orbit: "Trans-Lunar Injection",
    orbitAbbrev: "TLI",
    padName: "Launch Complex 1B",
    location: "Mahia Peninsula, New Zealand",
    countryCode: "NZL",
    image: ELECTRON_IMG,
    webcastLive: false,
    program: "NASA Artemis",
  },
  {
    id: "rec-3",
    name: "GSLV Mk III | Chandrayaan-3 Lunar Mission",
    status: "Launch Successful",
    statusAbbrev: "Success",
    launchTime: new Date(Date.now() - 6 * 86400000).toISOString(),
    provider: "ISRO",
    providerType: "Government",
    rocket: "LVM3 / GSLV Mk III",
    rocketFamily: "GSLV",
    missionName: "Chandrayaan-3 Lunar South Pole Lander",
    missionType: "Lunar Exploration",
    missionDescription: "Historic lunar soft landing mission deploying Vikram lander and Pragyan rover at the lunar south pole.",
    orbit: "Trans-Lunar Injection",
    orbitAbbrev: "TLI",
    padName: "Second Launch Pad",
    location: "SDSC SHAR, Sriharikota, India",
    countryCode: "IND",
    image: SCIENCE_IMG,
    webcastLive: false,
    program: "ISRO Lunar",
  },
  {
    id: "rec-4",
    name: "Falcon 9 | Crew-8 Mission to ISS",
    status: "Launch Successful",
    statusAbbrev: "Success",
    launchTime: new Date(Date.now() - 10 * 86400000).toISOString(),
    provider: "SpaceX",
    providerType: "Commercial",
    rocket: "Falcon 9 Block 5",
    rocketFamily: "Falcon",
    missionName: "Commercial Crew Crew-8",
    missionType: "Human Spaceflight",
    missionDescription: "Delivered four crew members to the International Space Station for a six-month science expedition.",
    orbit: "Low Earth Orbit",
    orbitAbbrev: "LEO",
    padName: "LC-39A",
    location: "Kennedy Space Center, FL, USA",
    countryCode: "USA",
    image: STARLINK_IMG,
    webcastLive: false,
    program: "Commercial Crew",
  },
  {
    id: "rec-5",
    name: "Vulcan Centaur | CERT-1 Peregrine",
    status: "Launch Successful",
    statusAbbrev: "Success",
    launchTime: new Date(Date.now() - 14 * 86400000).toISOString(),
    provider: "United Launch Alliance (ULA)",
    providerType: "Commercial",
    rocket: "Vulcan Centaur",
    rocketFamily: "Vulcan",
    missionName: "Peregrine Mission 1 Lander",
    missionType: "Lunar Lander",
    missionDescription: "Flawless maiden flight of ULA's next-generation heavy rocket delivering payloads to lunar transfer orbit.",
    orbit: "Trans-Lunar Injection",
    orbitAbbrev: "TLI",
    padName: "SLC-41",
    location: "Cape Canaveral SFS, FL, USA",
    countryCode: "USA",
    image: DEFAULT_ROCKET_IMG,
    webcastLive: false,
    program: "CLPS",
  },
  {
    id: "rec-6",
    name: "Falcon 9 | PACE Climate Observatory",
    status: "Launch Successful",
    statusAbbrev: "Success",
    launchTime: new Date(Date.now() - 18 * 86400000).toISOString(),
    provider: "SpaceX",
    providerType: "Commercial",
    rocket: "Falcon 9 Block 5",
    rocketFamily: "Falcon",
    missionName: "NASA PACE Atmosphere & Ocean Mission",
    missionType: "Earth Science",
    missionDescription: "Advanced Earth-observing satellite measuring ocean health, microscopic plankton, and atmospheric aerosols.",
    orbit: "Sun-Synchronous Orbit",
    orbitAbbrev: "SSO",
    padName: "SLC-40",
    location: "Cape Canaveral SFS, FL, USA",
    countryCode: "USA",
    image: SCIENCE_IMG,
    webcastLive: false,
    program: "NASA Earth",
  },
  {
    id: "rec-7",
    name: "Soyuz 2.1b | Progress MS-26",
    status: "Launch Successful",
    statusAbbrev: "Success",
    launchTime: new Date(Date.now() - 22 * 86400000).toISOString(),
    provider: "Roscosmos",
    providerType: "Government",
    rocket: "Soyuz 2.1b",
    rocketFamily: "Soyuz",
    missionName: "ISS Resupply Cargo Flight",
    missionType: "Resupply",
    missionDescription: "Delivered 2.5 tons of fuel, water, food, and pressurized scientific experiments to the space station.",
    orbit: "Low Earth Orbit",
    orbitAbbrev: "LEO",
    padName: "Site 31/6",
    location: "Baikonur Cosmodrome, Kazakhstan",
    countryCode: "KAZ",
    image: DEFAULT_ROCKET_IMG,
    webcastLive: false,
    program: "ISS Cargo",
  },
  {
    id: "rec-8",
    name: "Electron | Live and Let Fly",
    status: "Launch Successful",
    statusAbbrev: "Success",
    launchTime: new Date(Date.now() - 26 * 86400000).toISOString(),
    provider: "Rocket Lab",
    providerType: "Commercial",
    rocket: "Electron",
    rocketFamily: "Electron",
    missionName: "Open Cosmos SAR Satellite",
    missionType: "Earth Observation",
    missionDescription: "Commercial radar satellite deployment into 500km polar orbit with recovered 1st stage booster.",
    orbit: "Sun-Synchronous Orbit",
    orbitAbbrev: "SSO",
    padName: "Launch Complex 1A",
    location: "Mahia Peninsula, New Zealand",
    countryCode: "NZL",
    image: ELECTRON_IMG,
    webcastLive: false,
    program: "RocketLab Commercial",
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
    image: l.image || DEFAULT_ROCKET_IMG,
    webcastLive: l.webcast_live,
    program: l.program?.[0]?.name ?? null,
  };
}

router.get("/upcoming", async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 30, 50);
    const data = await fetchLL2(`/launch/upcoming/?limit=${limit}&format=json`) as { results: LL2Launch[]; count: number };
    res.json({ total: data.count || FALLBACK_UPCOMING.length, results: data.results.map(shapeLaunch) });
  } catch (err) {
    req.log.warn({ err }, "Using expanded fallback upcoming launch dataset");
    res.json({ total: FALLBACK_UPCOMING.length, results: FALLBACK_UPCOMING });
  }
});

router.get("/recent", async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 30, 50);
    const data = await fetchLL2(`/launch/previous/?limit=${limit}&format=json`) as { results: LL2Launch[]; count: number };
    res.json({ total: data.count || FALLBACK_RECENT.length, results: data.results.map(shapeLaunch) });
  } catch (err) {
    req.log.warn({ err }, "Using expanded fallback recent launch dataset");
    res.json({ total: FALLBACK_RECENT.length, results: FALLBACK_RECENT });
  }
});

export default router;
