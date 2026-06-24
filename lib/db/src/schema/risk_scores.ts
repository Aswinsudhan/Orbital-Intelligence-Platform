import { pgTable, serial, text, real, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const riskScoresTable = pgTable("risk_scores", {
  id: serial("id").primaryKey(),
  noradId: integer("norad_id").notNull().unique(),
  name: text("name").notNull(),
  score: real("score").notNull().default(0),
  category: text("category").notNull().default("low"),
  nearbyDebrisCount: real("nearby_debris_count").default(0),
  orbitCongestion: real("orbit_congestion").default(0),
  collisionProbability: real("collision_probability").default(0),
  satelliteAge: real("satellite_age").default(0),
  closeApproachFrequency: real("close_approach_frequency").default(0),
  lastCalculated: timestamp("last_calculated").defaultNow().notNull(),
});

export const insertRiskScoreSchema = createInsertSchema(riskScoresTable).omit({ id: true });
export type InsertRiskScore = z.infer<typeof insertRiskScoreSchema>;
export type RiskScore = typeof riskScoresTable.$inferSelect;
