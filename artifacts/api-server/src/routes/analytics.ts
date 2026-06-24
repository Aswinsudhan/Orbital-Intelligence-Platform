import { Router } from "express";
import { db, satellitesTable, debrisTable, riskScoresTable, collisionEventsTable, congestionHistoryTable } from "@workspace/db";
import { eq, sql, desc, asc } from "drizzle-orm";
import { GetOrbitalForecastQueryParams } from "@workspace/api-zod";

const router = Router();

router.get("/overview", async (req, res) => {
  try {
    const [satCount, debrisCount, rocketCount, highRisk, criticalRisk, collisionWarnings, latestHistory, orbitRows] = await Promise.all([
      db.select({ count: sql<number>`count(*)::int` }).from(satellitesTable),
      db.select({ count: sql<number>`count(*)::int` }).from(debrisTable).where(eq(debrisTable.objectType, "DEBRIS")),
      db.select({ count: sql<number>`count(*)::int` }).from(debrisTable).where(eq(debrisTable.objectType, "ROCKET BODY")),
      db.select({ count: sql<number>`count(*)::int` }).from(riskScoresTable).where(eq(riskScoresTable.category, "high")),
      db.select({ count: sql<number>`count(*)::int` }).from(riskScoresTable).where(eq(riskScoresTable.category, "critical")),
      db.select({ count: sql<number>`count(*)::int` }).from(collisionEventsTable).where(
        sql`${collisionEventsTable.riskLevel} IN ('high', 'critical')`
      ),
      db.select().from(congestionHistoryTable).orderBy(desc(congestionHistoryTable.recordedAt)).limit(1),
      db
        .select({
          orbitType: satellitesTable.orbitType,
          count: sql<number>`count(*)::int`,
        })
        .from(satellitesTable)
        .groupBy(satellitesTable.orbitType)
        .orderBy(desc(sql`count(*)`)),
    ]);

    const totalSats = satCount[0]?.count ?? 0;
    const orbitBreakdown = orbitRows.map((r) => ({
      orbitType: r.orbitType,
      count: r.count,
      percentage: totalSats > 0 ? Math.round((r.count / totalSats) * 1000) / 10 : 0,
    }));

    res.json({
      totalSatellites: totalSats,
      totalDebris: debrisCount[0]?.count ?? 0,
      totalRocketBodies: rocketCount[0]?.count ?? 0,
      highRiskObjects: highRisk[0]?.count ?? 0,
      criticalRiskObjects: criticalRisk[0]?.count ?? 0,
      lastRefresh: latestHistory[0]?.recordedAt?.toISOString() ?? null,
      orbitBreakdown,
      recentCollisionWarnings: collisionWarnings[0]?.count ?? 0,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get analytics overview");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/congestion", async (req, res) => {
  try {
    const altBandsRaw = await db
      .select({
        altitudeBand: sql<number>`FLOOR(${satellitesTable.altitude} / 200) * 200`,
        count: sql<number>`count(*)::int`,
      })
      .from(satellitesTable)
      .where(sql`${satellitesTable.altitude} IS NOT NULL`)
      .groupBy(sql`FLOOR(${satellitesTable.altitude} / 200) * 200`)
      .orderBy(asc(sql`FLOOR(${satellitesTable.altitude} / 200) * 200`))
      .limit(30);

    const incBandsRaw = await db
      .select({
        incBand: sql<number>`FLOOR(${satellitesTable.inclination} / 10) * 10`,
        count: sql<number>`count(*)::int`,
      })
      .from(satellitesTable)
      .where(sql`${satellitesTable.inclination} IS NOT NULL`)
      .groupBy(sql`FLOOR(${satellitesTable.inclination} / 10) * 10`)
      .orderBy(asc(sql`FLOOR(${satellitesTable.inclination} / 10) * 10`))
      .limit(20);

    const history = await db
      .select()
      .from(congestionHistoryTable)
      .orderBy(asc(congestionHistoryTable.recordedAt))
      .limit(60);

    const altitudeBands = altBandsRaw.map((r) => ({
      altitudeKm: r.altitudeBand,
      count: r.count,
      label: `${r.altitudeBand}-${r.altitudeBand + 200} km`,
    }));

    const densityByInclination = incBandsRaw.map((r) => ({
      inclinationDeg: r.incBand,
      count: r.count,
    }));

    const historyPoints = history.map((h) => ({
      date: h.recordedAt.toISOString().split("T")[0],
      totalObjects: h.totalObjects,
      satellites: h.satellites,
      debris: h.debris,
    }));

    res.json({ altitudeBands, densityByInclination, history: historyPoints });
  } catch (err) {
    req.log.error({ err }, "Failed to get congestion data");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/forecast", async (req, res) => {
  try {
    const parsed = GetOrbitalForecastQueryParams.safeParse(req.query);
    const horizon = parsed.success ? (parsed.data.horizon ?? "30d") : "30d";

    const history = await db
      .select()
      .from(congestionHistoryTable)
      .orderBy(asc(congestionHistoryTable.recordedAt))
      .limit(30);

    const days = horizon === "30d" ? 30 : horizon === "90d" ? 90 : 365;

    const latestCount = history.length > 0 ? history[history.length - 1].totalObjects : 10000;
    const growthRate = 0.002 + Math.random() * 0.002;

    const dataPoints = [];
    for (let i = 1; i <= days; i += Math.max(1, Math.floor(days / 30))) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const predicted = Math.round(latestCount * Math.pow(1 + growthRate, i / 30));
      const uncertainty = predicted * 0.05 * (i / days);
      dataPoints.push({
        date: date.toISOString().split("T")[0],
        predicted,
        lower: Math.round(predicted - uncertainty),
        upper: Math.round(predicted + uncertainty),
      });
    }

    res.json({
      horizon,
      dataPoints,
      trend: "increasing",
      confidence: Math.round((0.95 - (days / 1000)) * 100) / 100,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get forecast");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/orbit-distribution", async (req, res) => {
  try {
    const [satRows, debrisRows] = await Promise.all([
      db
        .select({ orbitType: satellitesTable.orbitType, count: sql<number>`count(*)::int` })
        .from(satellitesTable)
        .groupBy(satellitesTable.orbitType),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(debrisTable),
    ]);

    const total = satRows.reduce((a, b) => a + b.count, 0) + (debrisRows[0]?.count ?? 0);

    const result = [
      ...satRows.map((r) => ({
        orbitType: r.orbitType,
        count: r.count,
        percentage: total > 0 ? Math.round((r.count / total) * 1000) / 10 : 0,
      })),
      {
        orbitType: "Debris/R-Bodies",
        count: debrisRows[0]?.count ?? 0,
        percentage: total > 0 ? Math.round(((debrisRows[0]?.count ?? 0) / total) * 1000) / 10 : 0,
      },
    ];

    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Failed to get orbit distribution");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
