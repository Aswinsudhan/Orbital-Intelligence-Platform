import { db, satellitesTable, debrisTable, riskScoresTable, collisionEventsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { logger } from "./logger";

function computeRiskScore(factors: {
  nearbyDebrisCount: number;
  orbitCongestion: number;
  collisionProbability: number;
  satelliteAge: number;
  closeApproachFrequency: number;
}): { score: number; category: string } {
  const weights = {
    nearbyDebrisCount: 0.30,
    orbitCongestion: 0.25,
    collisionProbability: 0.20,
    satelliteAge: 0.10,
    closeApproachFrequency: 0.15,
  };

  const score = Math.min(100, Math.max(0,
    factors.nearbyDebrisCount * weights.nearbyDebrisCount +
    factors.orbitCongestion * weights.orbitCongestion +
    factors.collisionProbability * weights.collisionProbability +
    factors.satelliteAge * weights.satelliteAge +
    factors.closeApproachFrequency * weights.closeApproachFrequency
  ));

  let category: string;
  if (score <= 25) category = "low";
  else if (score <= 50) category = "medium";
  else if (score <= 75) category = "high";
  else category = "critical";

  return { score: Math.round(score * 10) / 10, category };
}

export async function computeAllRiskScores(): Promise<void> {
  logger.info("Computing risk scores for all satellites");

  const satellites = await db.select().from(satellitesTable).limit(1000);
  const allDebris = await db.select({ altitude: debrisTable.altitude, inclination: debrisTable.inclination }).from(debrisTable);

  const debrisCount = allDebris.length;

  for (const sat of satellites) {
    try {
      let nearbyDebrisCount = 0;
      if (sat.altitude !== null) {
        const altRange = 50;
        nearbyDebrisCount = allDebris.filter((d) => {
          if (d.altitude === null) return false;
          return Math.abs(d.altitude - (sat.altitude ?? 0)) < altRange;
        }).length;
      }

      const nearbyFactor = Math.min(100, (nearbyDebrisCount / Math.max(1, debrisCount * 0.05)) * 100);

      let orbitCongestion = 0;
      if (sat.orbitType === "LEO") orbitCongestion = 70 + Math.random() * 20;
      else if (sat.orbitType === "GEO") orbitCongestion = 50 + Math.random() * 20;
      else if (sat.orbitType === "MEO") orbitCongestion = 30 + Math.random() * 20;
      else orbitCongestion = 20 + Math.random() * 30;

      let satelliteAge = 0;
      if (sat.epoch) {
        const epochDate = new Date(sat.epoch);
        const ageYears = (Date.now() - epochDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
        satelliteAge = Math.min(100, ageYears * 5);
      }

      const collisionProbability = Math.min(100, nearbyFactor * 0.3 + orbitCongestion * 0.2 + Math.random() * 20);
      const closeApproachFrequency = Math.min(100, nearbyFactor * 0.4 + Math.random() * 20);

      const factors = {
        nearbyDebrisCount: nearbyFactor,
        orbitCongestion,
        collisionProbability,
        satelliteAge,
        closeApproachFrequency,
      };

      const { score, category } = computeRiskScore(factors);

      await db
        .insert(riskScoresTable)
        .values({
          noradId: sat.noradId,
          name: sat.name,
          score,
          category,
          nearbyDebrisCount: nearbyFactor,
          orbitCongestion,
          collisionProbability,
          satelliteAge,
          closeApproachFrequency,
          lastCalculated: new Date(),
        })
        .onConflictDoUpdate({
          target: riskScoresTable.noradId,
          set: {
            name: sat.name,
            score,
            category,
            nearbyDebrisCount: nearbyFactor,
            orbitCongestion,
            collisionProbability,
            satelliteAge,
            closeApproachFrequency,
            lastCalculated: new Date(),
          },
        });
    } catch (err) {
      logger.error({ err, noradId: sat.noradId }, "Failed to compute risk score");
    }
  }

  logger.info("Risk score computation complete");
}

export async function detectCollisionEvents(): Promise<void> {
  logger.info("Detecting collision events");

  const satellites = await db.select().from(satellitesTable).limit(200);
  const debris = await db.select().from(debrisTable).limit(500);

  const newEvents: Array<{
    object1NoradId: number;
    object1Name: string;
    object2NoradId: number;
    object2Name: string;
    missDistanceKm: number;
    riskLevel: string;
    probability: number;
  }> = [];

  for (const sat of satellites) {
    if (sat.altitude === null) continue;

    const nearbyDebris = debris.filter((d) => {
      if (d.altitude === null) return false;
      const altDiff = Math.abs(d.altitude - (sat.altitude ?? 0));
      const incDiff = sat.inclination !== null && d.inclination !== null
        ? Math.abs(d.inclination - sat.inclination)
        : 999;
      return altDiff < 20 && incDiff < 10;
    });

    for (const d of nearbyDebris.slice(0, 3)) {
      if (d.altitude === null) continue;
      const altDiff = Math.abs(d.altitude - (sat.altitude ?? 0));
      const missDistance = Math.max(0.1, altDiff * 0.3 + Math.random() * 5);

      let riskLevel: string;
      let probability: number;
      if (missDistance < 0.5) { riskLevel = "critical"; probability = 0.8 + Math.random() * 0.2; }
      else if (missDistance < 2) { riskLevel = "high"; probability = 0.4 + Math.random() * 0.4; }
      else if (missDistance < 5) { riskLevel = "medium"; probability = 0.1 + Math.random() * 0.3; }
      else { riskLevel = "low"; probability = Math.random() * 0.1; }

      newEvents.push({
        object1NoradId: sat.noradId,
        object1Name: sat.name,
        object2NoradId: d.noradId,
        object2Name: d.name,
        missDistanceKm: Math.round(missDistance * 100) / 100,
        riskLevel,
        probability: Math.round(probability * 1000) / 1000,
      });
    }
  }

  if (newEvents.length > 0) {
    await db.delete(collisionEventsTable);
    await db.insert(collisionEventsTable).values(
      newEvents.slice(0, 500).map((e) => ({
        ...e,
        detectedAt: new Date(),
      }))
    );
  }

  logger.info({ count: newEvents.length }, "Collision event detection complete");
}
