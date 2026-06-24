import { pgTable, serial, text, real, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const collisionEventsTable = pgTable("collision_events", {
  id: serial("id").primaryKey(),
  object1NoradId: integer("object1_norad_id").notNull(),
  object1Name: text("object1_name").notNull(),
  object2NoradId: integer("object2_norad_id").notNull(),
  object2Name: text("object2_name").notNull(),
  missDistanceKm: real("miss_distance_km").notNull(),
  riskLevel: text("risk_level").notNull().default("low"),
  probability: real("probability"),
  predictedTime: timestamp("predicted_time"),
  detectedAt: timestamp("detected_at").defaultNow().notNull(),
});

export const insertCollisionEventSchema = createInsertSchema(collisionEventsTable).omit({ id: true });
export type InsertCollisionEvent = z.infer<typeof insertCollisionEventSchema>;
export type CollisionEvent = typeof collisionEventsTable.$inferSelect;
