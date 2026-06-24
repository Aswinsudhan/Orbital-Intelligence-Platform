import { pgTable, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const congestionHistoryTable = pgTable("congestion_history", {
  id: serial("id").primaryKey(),
  totalObjects: integer("total_objects").notNull().default(0),
  satellites: integer("satellites").notNull().default(0),
  debris: integer("debris").notNull().default(0),
  rocketBodies: integer("rocket_bodies").notNull().default(0),
  recordedAt: timestamp("recorded_at").defaultNow().notNull(),
});

export const insertCongestionHistorySchema = createInsertSchema(congestionHistoryTable).omit({ id: true });
export type InsertCongestionHistory = z.infer<typeof insertCongestionHistorySchema>;
export type CongestionHistory = typeof congestionHistoryTable.$inferSelect;
