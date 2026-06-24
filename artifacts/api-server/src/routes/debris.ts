import { Router } from "express";
import { db, debrisTable } from "@workspace/db";
import { eq, ilike, and, asc, sql, or } from "drizzle-orm";
import { ListDebrisQueryParams } from "@workspace/api-zod";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const parsed = ListDebrisQueryParams.safeParse(req.query);
    const params = parsed.success ? parsed.data : {};

    const {
      type,
      search,
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
          ilike(debrisTable.name, `%${search}%`),
          sql`CAST(${debrisTable.noradId} AS TEXT) ILIKE ${`%${search}%`}`
        )
      );
    }

    if (type && type !== "all") {
      if (type === "debris") {
        conditions.push(eq(debrisTable.objectType, "DEBRIS"));
      } else if (type === "rocket_body") {
        conditions.push(eq(debrisTable.objectType, "ROCKET BODY"));
      }
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [data, countResult] = await Promise.all([
      db
        .select()
        .from(debrisTable)
        .where(whereClause)
        .orderBy(asc(debrisTable.name))
        .limit(limitNum)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(debrisTable)
        .where(whereClause),
    ]);

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
        lastUpdated: d.lastUpdated,
      })),
      total: countResult[0]?.count ?? 0,
      page: pageNum,
      limit: limitNum,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to list debris");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
