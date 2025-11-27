import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";

export const letters = pgTable("letters", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  title: varchar("title", { length: 255 }),
  name: varchar("name", { length: 255 }),
  profession: text("profession"), // Can be long, keep as text
  position: text("position"),
  company: varchar("company", { length: 255 }),
  location: varchar("location", { length: 100 }),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 320 }),
  nameRecipient: varchar("nameRecipient", { length: 255 }),
  positionRecipient: text("positionRecipient"),
  text: text("text"),
  template: varchar("template", { length: 255 }).notNull(),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => sql`CURRENT_TIMESTAMP`
  ),
});
