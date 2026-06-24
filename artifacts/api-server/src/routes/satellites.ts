import { Router } from "express";
import { db, satellitesTable, riskScoresTable } from "@workspace/db";
import { eq, ilike, and, asc, desc, sql, or } from "drizzle-orm";
import { ListSatellitesQueryParams, GetSatelliteParams } from "@workspace/api-zod";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const parsed = ListSatellitesQueryParams.safeParse(req.query);
    const params = parsed.success ? parsed.data : {};

    const {
      search,
      orbitType,
      sortBy = "name",
      sortOrder = "asc",
      page = 1,
      limit = 50,
    } = params;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(200, Math.max(1, Number(limit)));
    const offset = (pageNum - 1) * limitNum;

    const conditions = [];

    if (search) {
      conditions.push(
        or(
          ilike(satellitesTable.name, `%${search}%`),
          sql`CAST(${satellitesTable.noradId} AS TEXT) ILIKE ${`%${search}%`}`
        )
      );
    }

    if (orbitType) {
      conditions.push(eq(satellitesTable.orbitType, orbitType));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const sortColumn = {
      name: satellitesTable.name,
      altitude: satellitesTable.altitude,
      inclination: satellitesTable.inclination,
      noradId: satellitesTable.noradId,
    }[sortBy as string] ?? satellitesTable.name;

    const orderFn = sortOrder === "desc" ? desc : asc;

    const [data, countResult] = await Promise.all([
      db
        .select()
        .from(satellitesTable)
        .where(whereClause)
        .orderBy(orderFn(sortColumn))
        .limit(limitNum)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(satellitesTable)
        .where(whereClause),
    ]);

    res.json({
      data: data.map((s) => ({
        id: s.id,
        noradId: s.noradId,
        name: s.name,
        orbitType: s.orbitType,
        altitude: s.altitude,
        inclination: s.inclination,
        velocity: s.velocity,
        eccentricity: s.eccentricity,
        raan: s.raan,
        epoch: s.epoch,
        lastUpdated: s.lastUpdated,
      })),
      total: countResult[0]?.count ?? 0,
      page: pageNum,
      limit: limitNum,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to list satellites");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const parsed = GetSatelliteParams.safeParse({ id: parseInt(req.params.id, 10) });
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }

    const [sat] = await db
      .select()
      .from(satellitesTable)
      .where(eq(satellitesTable.id, parsed.data.id));

    if (!sat) {
      res.status(404).json({ error: "Satellite not found" });
      return;
    }

    const [riskScore] = await db
      .select()
      .from(riskScoresTable)
      .where(eq(riskScoresTable.noradId, sat.noradId));

    res.json({
      id: sat.id,
      noradId: sat.noradId,
      name: sat.name,
      orbitType: sat.orbitType,
      altitude: sat.altitude,
      inclination: sat.inclination,
      velocity: sat.velocity,
      eccentricity: sat.eccentricity,
      raan: sat.raan,
      epoch: sat.epoch,
      lastUpdated: sat.lastUpdated,
      riskScore: riskScore?.score ?? null,
      riskCategory: riskScore?.category ?? null,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get satellite");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
