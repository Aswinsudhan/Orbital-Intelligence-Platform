import { Router } from "express";
import { db, riskScoresTable, collisionEventsTable, satellitesTable } from "@workspace/db";
import { eq, desc, sql, and, inArray } from "drizzle-orm";
import { ListRiskScoresQueryParams, GetRiskScoreParams, ListCollisionsQueryParams } from "@workspace/api-zod";

const router = Router();

router.get("/scores", async (req, res) => {
  try {
    const parsed = ListRiskScoresQueryParams.safeParse(req.query);
    const params = parsed.success ? parsed.data : {};
    const { category, limit = 100 } = params;

    const conditions = [];
    if (category) {
      conditions.push(eq(riskScoresTable.category, category));
    }

    const data = await db
      .select()
      .from(riskScoresTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(riskScoresTable.score))
      .limit(Math.min(500, Number(limit)));

    // Determine which NORAD IDs belong to the satellites table
    const noradIds = data.map((r) => r.noradId);
    const satRows = noradIds.length > 0
      ? await db.select({ noradId: satellitesTable.noradId }).from(satellitesTable).where(inArray(satellitesTable.noradId, noradIds))
      : [];
    const satSet = new Set(satRows.map((s) => s.noradId));

    res.json(
      data.map((r) => ({
        noradId: r.noradId,
        name: r.name,
        score: r.score,
        category: r.category,
        lastCalculated: r.lastCalculated,
        objectType: satSet.has(r.noradId) ? "satellite" : "debris",
      }))
    );
  } catch (err) {
    req.log.error({ err }, "Failed to list risk scores");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/scores/:noradId", async (req, res) => {
  try {
    const noradId = parseInt(req.params.noradId, 10);
    if (isNaN(noradId)) {
      res.status(400).json({ error: "Invalid NORAD ID" });
      return;
    }

    const [score] = await db
      .select()
      .from(riskScoresTable)
      .where(eq(riskScoresTable.noradId, noradId));

    if (!score) {
      res.status(404).json({ error: "Risk score not found" });
      return;
    }

    res.json({
      noradId: score.noradId,
      name: score.name,
      score: score.score,
      category: score.category,
      lastCalculated: score.lastCalculated,
      factors: {
        nearbyDebrisCount: score.nearbyDebrisCount ?? 0,
        orbitCongestion: score.orbitCongestion ?? 0,
        collisionProbability: score.collisionProbability ?? 0,
        satelliteAge: score.satelliteAge ?? 0,
        closeApproachFrequency: score.closeApproachFrequency ?? 0,
      },
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get risk score");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/collisions", async (req, res) => {
  try {
    const parsed = ListCollisionsQueryParams.safeParse(req.query);
    const params = parsed.success ? parsed.data : {};
    const { riskLevel, limit = 100 } = params;

    const conditions = [];
    if (riskLevel) {
      conditions.push(eq(collisionEventsTable.riskLevel, riskLevel));
    }

    const [data, highRisk, critical] = await Promise.all([
      db
        .select()
        .from(collisionEventsTable)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(collisionEventsTable.detectedAt))
        .limit(Math.min(500, Number(limit))),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(collisionEventsTable)
        .where(eq(collisionEventsTable.riskLevel, "high")),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(collisionEventsTable)
        .where(eq(collisionEventsTable.riskLevel, "critical")),
    ]);

    res.json({
      data: data.map((c) => ({
        id: c.id,
        object1Name: c.object1Name,
        object2Name: c.object2Name,
        object1NoradId: c.object1NoradId,
        object2NoradId: c.object2NoradId,
        missDistanceKm: c.missDistanceKm,
        riskLevel: c.riskLevel,
        predictedTime: c.predictedTime?.toISOString() ?? null,
        probability: c.probability,
      })),
      total: data.length,
      highRiskCount: highRisk[0]?.count ?? 0,
      criticalCount: critical[0]?.count ?? 0,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to list collisions");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
