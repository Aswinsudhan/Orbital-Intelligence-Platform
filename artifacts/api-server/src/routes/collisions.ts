import { Router } from "express";
import { db, collisionEventsTable } from "@workspace/db";
import { eq, desc, and } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { ListCollisionsQueryParams } from "@workspace/api-zod";

const router = Router();

router.get("/", async (req, res) => {
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
