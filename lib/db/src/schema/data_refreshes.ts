import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const dataRefreshesTable = pgTable("data_refreshes", {
  id: serial("id").primaryKey(),
  status: text("status").notNull().default("success"),
  satellitesFetched: integer("satellites_fetched").default(0),
  debrisFetched: integer("debris_fetched").default(0),
  rocketBodiesFetched: integer("rocket_bodies_fetched").default(0),
  errorMessage: text("error_message"),
  triggeredBy: text("triggered_by").notNull().default("scheduler"),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
});

export const insertDataRefreshSchema = createInsertSchema(dataRefreshesTable).omit({ id: true });
export type InsertDataRefresh = z.infer<typeof insertDataRefreshSchema>;
export type DataRefresh = typeof dataRefreshesTable.$inferSelect;
