import { pgTable, serial, text, real, integer, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const debrisTable = pgTable(
  "debris",
  {
    id: serial("id").primaryKey(),
    noradId: integer("norad_id").notNull().unique(),
    name: text("name").notNull(),
    objectType: text("object_type").notNull().default("DEBRIS"),
    altitude: real("altitude"),
    inclination: real("inclination"),
    eccentricity: real("eccentricity"),
    epoch: text("epoch"),
    tle1: text("tle1"),
    tle2: text("tle2"),
    lastUpdated: timestamp("last_updated").defaultNow().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("debris_norad_idx").on(t.noradId), index("debris_type_idx").on(t.objectType)],
);

export const insertDebrisSchema = createInsertSchema(debrisTable).omit({ id: true, createdAt: true });
export type InsertDebris = z.infer<typeof insertDebrisSchema>;
export type Debris = typeof debrisTable.$inferSelect;
