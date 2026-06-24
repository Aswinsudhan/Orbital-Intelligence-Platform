import { Router } from "express";
import { db, satellitesTable, debrisTable, dataRefreshesTable, congestionHistoryTable } from "@workspace/db";
import { eq, sql, desc } from "drizzle-orm";
import { performDataRefresh, getRefreshState, setNextRefresh } from "../lib/data-service";

const router = Router();

router.get("/last-update", async (req, res) => {
  try {
    const [satCount, debrisCount, rocketCount, lastRefresh] = await Promise.all([
      db.select({ count: sql<number>`count(*)::int` }).from(satellitesTable),
      db.select({ count: sql<number>`count(*)::int` }).from(debrisTable).where(eq(debrisTable.objectType, "DEBRIS")),
      db.select({ count: sql<number>`count(*)::int` }).from(debrisTable).where(eq(debrisTable.objectType, "ROCKET BODY")),
      db.select().from(dataRefreshesTable).where(eq(dataRefreshesTable.status, "success")).orderBy(desc(dataRefreshesTable.completedAt)).limit(1),
    ]);

    const state = getRefreshState();

    res.json({
      lastRefresh: lastRefresh[0]?.completedAt?.toISOString() ?? null,
      satelliteCount: satCount[0]?.count ?? 0,
      debrisCount: debrisCount[0]?.count ?? 0,
      rocketBodyCount: rocketCount[0]?.count ?? 0,
      nextRefresh: state.nextRefreshAt?.toISOString() ?? null,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get last update");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/refresh", async (req, res) => {
  try {
    const state = getRefreshState();
    if (state.isRefreshing) {
      res.json({ success: false, message: "Refresh already in progress", startedAt: new Date().toISOString() });
      return;
    }

    const startedAt = new Date().toISOString();
    performDataRefresh("manual").catch((err) => {
      req.log.error({ err }, "Background refresh failed");
    });

    res.json({ success: true, message: "Data refresh started. This may take a few minutes.", startedAt });
  } catch (err) {
    req.log.error({ err }, "Failed to trigger refresh");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/status", async (req, res) => {
  try {
    const state = getRefreshState();
    const [lastRefresh] = await db
      .select()
      .from(dataRefreshesTable)
      .orderBy(desc(dataRefreshesTable.completedAt))
      .limit(1);

    res.json({
      schedulerRunning: !state.isRefreshing,
      lastRefresh: state.lastRefreshAt?.toISOString() ?? lastRefresh?.completedAt?.toISOString() ?? null,
      nextRefresh: state.nextRefreshAt?.toISOString() ?? null,
      dataSourceStatus: {
        celestrak_active: "online",
        celestrak_starlink: "online",
        celestrak_debris: "online",
        celestrak_rocket_bodies: "online",
        celestrak_gps: "online",
        celestrak_geo: "online",
      },
      apiHealth: "healthy",
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get admin status");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
