import { pgTable, serial, text, real, integer, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const satellitesTable = pgTable(
  "satellites",
  {
    id: serial("id").primaryKey(),
    noradId: integer("norad_id").notNull().unique(),
    name: text("name").notNull(),
    orbitType: text("orbit_type").notNull().default("Unknown"),
    altitude: real("altitude"),
    inclination: real("inclination"),
    velocity: real("velocity"),
    eccentricity: real("eccentricity"),
    raan: real("raan"),
    epoch: text("epoch"),
    tle1: text("tle1"),
    tle2: text("tle2"),
    lastUpdated: timestamp("last_updated").defaultNow().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("satellites_norad_idx").on(t.noradId), index("satellites_orbit_idx").on(t.orbitType)],
);

export const insertSatelliteSchema = createInsertSchema(satellitesTable).omit({ id: true, createdAt: true });
export type InsertSatellite = z.infer<typeof insertSatelliteSchema>;
export type Satellite = typeof satellitesTable.$inferSelect;
