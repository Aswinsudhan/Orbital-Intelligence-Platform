import { Router } from "express";
import { db, satellitesTable, debrisTable } from "@workspace/db";
import { eq, or } from "drizzle-orm";
import * as satellite from "satellite.js";

const router = Router();

// GET /api/rocket-bodies
router.get("/rocket-bodies", async (req, res) => {
  try {
    const limitParam = Number(req.query.limit || 500);
    const limitNum = Math.min(2000, Math.max(1, limitParam));

    const data = await db
      .select()
      .from(debrisTable)
      .where(eq(debrisTable.objectType, "ROCKET BODY"))
      .limit(limitNum);

    res.json({
      data: data.map((d) => ({
        id: d.id,
        noradId: d.noradId,
        name: d.name,
        objectType: d.objectType,
        altitude: d.altitude,
        inclination: d.inclination,
        eccentricity: d.eccentricity,
        epoch: d.epoch,
        tle1: d.tle1,
        tle2: d.tle2,
        lastUpdated: d.lastUpdated,
      })),
      total: data.length,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch rocket bodies");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/orbital-position/:noradId
router.get("/orbital-position/:noradId", async (req, res) => {
  try {
    const noradId = parseInt(req.params.noradId, 10);
    if (isNaN(noradId)) {
      res.status(400).json({ error: "Invalid NORAD ID" });
      return;
    }

    // Search in satellitesTable first
    const [sat] = await db
      .select()
      .from(satellitesTable)
      .where(eq(satellitesTable.noradId, noradId));

    let record: {
      noradId: number;
      name: string;
      objectType: string;
      orbitType: string;
      tle1: string | null;
      tle2: string | null;
      inclination: number | null;
      altitude: number | null;
      lastUpdated: Date;
    } | null = null;

    if (sat) {
      record = {
        noradId: sat.noradId,
        name: sat.name,
        objectType: "ACTIVE",
        orbitType: sat.orbitType ?? "LEO",
        tle1: sat.tle1,
        tle2: sat.tle2,
        inclination: sat.inclination,
        altitude: sat.altitude,
        lastUpdated: sat.lastUpdated,
      };
    } else {
      const [deb] = await db
        .select()
        .from(debrisTable)
        .where(eq(debrisTable.noradId, noradId));

      if (deb) {
        record = {
          noradId: deb.noradId,
          name: deb.name,
          objectType: deb.objectType,
          orbitType: (deb.altitude ?? 0) < 2000 ? "LEO" : "MEO",
          tle1: deb.tle1,
          tle2: deb.tle2,
          inclination: deb.inclination,
          altitude: deb.altitude,
          lastUpdated: deb.lastUpdated,
        };
      }
    }

    if (!record || !record.tle1 || !record.tle2) {
      res.status(404).json({ error: "Orbital object or TLE data not found" });
      return;
    }

    const now = new Date();
    const satrec = satellite.twoline2satrec(record.tle1, record.tle2);
    const posVel = satellite.propagate(satrec, now);

    if (
      !posVel ||
      !posVel.position ||
      typeof posVel.position === "boolean" ||
      !posVel.velocity ||
      typeof posVel.velocity === "boolean"
    ) {
      res.status(500).json({ error: "Failed to propagate orbital position from TLE" });
      return;
    }

    const gmst = satellite.gstime(now);
    const pos = posVel.position as satellite.EciVec3<satellite.Kilometer>;
    const vel = posVel.velocity as satellite.EciVec3<satellite.KilometerPerSecond>;

    const geo = satellite.eciToGeodetic(pos, gmst);

    const latitude = satellite.degreesLat(geo.latitude);
    const longitude = satellite.degreesLong(geo.longitude);
    const altitude = Math.round(geo.height * 10) / 10;

    const velocity = Math.round(Math.sqrt(vel.x ** 2 + vel.y ** 2 + vel.z ** 2) * 100) / 100;

    // Generate predicted 3D path over 1 full orbit period (approx 90-120 mins for LEO)
    const predictedPath: Array<{ latitude: number; longitude: number; altitude: number; timestamp: string }> = [];
    const meanMotion = satrec.no * (720 / Math.PI); // revs per day
    const periodMinutes = meanMotion > 0 ? 1440 / meanMotion : 95;
    const stepSeconds = (periodMinutes * 60) / 60; // 60 points along orbit

    for (let i = 0; i <= 60; i++) {
      const stepDate = new Date(now.getTime() + i * stepSeconds * 1000);
      const stepPv = satellite.propagate(satrec, stepDate);
      if (stepPv && stepPv.position && typeof stepPv.position !== "boolean") {
        const stepGmst = satellite.gstime(stepDate);
        const stepGeo = satellite.eciToGeodetic(stepPv.position as satellite.EciVec3<satellite.Kilometer>, stepGmst);
        predictedPath.push({
          latitude: satellite.degreesLat(stepGeo.latitude),
          longitude: satellite.degreesLong(stepGeo.longitude),
          altitude: Math.round(stepGeo.height * 10) / 10,
          timestamp: stepDate.toISOString(),
        });
      }
    }

    res.json({
      noradId: record.noradId,
      name: record.name,
      objectType: record.objectType,
      orbitType: record.orbitType,
      latitude: Math.round(latitude * 10000) / 10000,
      longitude: Math.round(longitude * 10000) / 10000,
      altitude,
      velocity,
      inclination: record.inclination,
      positionEci: pos,
      velocityEci: vel,
      tle1: record.tle1,
      tle2: record.tle2,
      lastUpdated: record.lastUpdated,
      calculationTimestamp: now.toISOString(),
      predictedPath,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to compute orbital position");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
