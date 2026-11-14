import { db, satellitesTable, debrisTable, dataRefreshesTable, congestionHistoryTable } from "@workspace/db";
import { fetchSatellites, fetchDebris } from "./celestrak";
import { computeAllRiskScores, detectCollisionEvents } from "./risk-engine";
import { logger } from "./logger";

let isRefreshing = false;
let lastRefreshAt: Date | null = null;
let nextRefreshAt: Date | null = null;
let schedulerTimer: ReturnType<typeof setInterval> | null = null;
let schedulerIntervalMinutes = 30;

export function getRefreshState() {
  return {
    isRefreshing,
    lastRefreshAt,
    nextRefreshAt,
    schedulerRunning: schedulerTimer !== null,
    schedulerIntervalMinutes,
  };
}

export function startScheduler(intervalMinutes: number) {
  if (schedulerTimer) {
    clearInterval(schedulerTimer);
  }
  schedulerIntervalMinutes = intervalMinutes;
  const ms = intervalMinutes * 60 * 1000;

  const tick = async () => {
    logger.info({ intervalMinutes }, "Auto-sync triggered by scheduler");
    nextRefreshAt = new Date(Date.now() + ms);
    await performDataRefresh("scheduler");
    nextRefreshAt = new Date(Date.now() + ms);
  };

  nextRefreshAt = new Date(Date.now() + ms);
  schedulerTimer = setInterval(tick, ms);
  logger.info({ intervalMinutes }, "Auto-sync scheduler started");
}

export function stopScheduler() {
  if (schedulerTimer) {
    clearInterval(schedulerTimer);
    schedulerTimer = null;
  }
  nextRefreshAt = null;
  logger.info("Auto-sync scheduler stopped");
}

export function setNextRefresh(date: Date) {
  nextRefreshAt = date;
}

export async function performDataRefresh(triggeredBy = "scheduler"): Promise<{
  success: boolean;
  satellitesFetched: number;
  debrisFetched: number;
  rocketBodiesFetched: number;
  errorMessage?: string;
}> {
  if (isRefreshing) {
    return { success: false, satellitesFetched: 0, debrisFetched: 0, rocketBodiesFetched: 0, errorMessage: "Refresh already in progress" };
  }

  isRefreshing = true;
  logger.info({ triggeredBy }, "Starting data refresh from CelesTrak");

  try {
    const [satellites, debrisData] = await Promise.all([
      fetchSatellites(),
      fetchDebris(),
    ]);

    const satellites_data = satellites;
    let satellitesFetched = 0;
    const BATCH_SIZE = 50;

    // Concurrently process batches of 50 to avoid connection pool exhaustion while maximizing speed
    for (let i = 0; i < satellites_data.length; i += BATCH_SIZE) {
      const chunk = satellites_data.slice(i, i + BATCH_SIZE);
      await Promise.all(
        chunk.map((sat) =>
          db
            .insert(satellitesTable)
            .values({
              noradId: sat.noradId,
              name: sat.name,
              orbitType: sat.orbitType,
              altitude: sat.altitude,
              inclination: sat.inclination,
              velocity: sat.velocity,
              eccentricity: sat.eccentricity,
              raan: sat.raan,
              epoch: sat.epoch,
              tle1: sat.tle1,
              tle2: sat.tle2,
              lastUpdated: new Date(),
            })
            .onConflictDoUpdate({
              target: satellitesTable.noradId,
              set: {
                name: sat.name,
                orbitType: sat.orbitType,
                altitude: sat.altitude,
                inclination: sat.inclination,
                velocity: sat.velocity,
                eccentricity: sat.eccentricity,
                raan: sat.raan,
                epoch: sat.epoch,
                tle1: sat.tle1,
                tle2: sat.tle2,
                lastUpdated: new Date(),
              },
            })
        )
      );
      satellitesFetched += chunk.length;
    }

    let debrisFetched = 0;
    let rocketBodiesFetched = 0;

    for (let i = 0; i < debrisData.length; i += BATCH_SIZE) {
      const chunk = debrisData.slice(i, i + BATCH_SIZE);
      await Promise.all(
        chunk.map((d) =>
          db
            .insert(debrisTable)
            .values({
              noradId: d.noradId,
              name: d.name,
              objectType: d.objectType,
              altitude: d.altitude,
              inclination: d.inclination,
              eccentricity: d.eccentricity,
              epoch: d.epoch,
              tle1: d.tle1,
              tle2: d.tle2,
              lastUpdated: new Date(),
            })
            .onConflictDoUpdate({
              target: debrisTable.noradId,
              set: {
                name: d.name,
                objectType: d.objectType,
                altitude: d.altitude,
                inclination: d.inclination,
                eccentricity: d.eccentricity,
                epoch: d.epoch,
                tle1: d.tle1,
                tle2: d.tle2,
                lastUpdated: new Date(),
              },
            })
        )
      );
      for (const d of chunk) {
        if (d.objectType === "DEBRIS") debrisFetched++;
        else rocketBodiesFetched++;
      }
    }

    await db.insert(congestionHistoryTable).values({
      totalObjects: satellitesFetched + debrisFetched + rocketBodiesFetched,
      satellites: satellitesFetched,
      debris: debrisFetched,
      rocketBodies: rocketBodiesFetched,
      recordedAt: new Date(),
    });

    await computeAllRiskScores();
    await detectCollisionEvents();

    lastRefreshAt = new Date();

    await db.insert(dataRefreshesTable).values({
      status: "success",
      satellitesFetched,
      debrisFetched,
      rocketBodiesFetched,
      triggeredBy,
      completedAt: new Date(),
    });

    logger.info({ satellitesFetched, debrisFetched, rocketBodiesFetched }, "Data refresh complete");
    return { success: true, satellitesFetched, debrisFetched, rocketBodiesFetched };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    logger.error({ err }, "Data refresh failed");

    try {
      await db.insert(dataRefreshesTable).values({
        status: "error",
        satellitesFetched: 0,
        debrisFetched: 0,
        rocketBodiesFetched: 0,
        errorMessage,
        triggeredBy,
        completedAt: new Date(),
      });
    } catch {}

    return { success: false, satellitesFetched: 0, debrisFetched: 0, rocketBodiesFetched: 0, errorMessage };
  } finally {
    isRefreshing = false;
  }
}
