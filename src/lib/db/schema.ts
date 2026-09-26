import { jsonb, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import type { Vessel } from "@/lib/types";

/** Auth.js Credentials user — passwordHash is app-owned (not Auth.js Account). */
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [uniqueIndex("users_email_uidx").on(t.email)]);

/**
 * One vessel per user. Rite fields live in `rite` JSON so the client Vessel
 * shape can evolve without a migration per column.
 */
export const vessels = pgTable("vessels", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  /** Full Vessel JSON (name, role, people, style, class, bio, status, …). */
  rite: jsonb("rite").$type<Vessel>().notNull(),
  status: text("status").notNull().default("pending_gm"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [uniqueIndex("vessels_user_uidx").on(t.userId)]);

export type DbUser = typeof users.$inferSelect;
export type DbVessel = typeof vessels.$inferSelect;
