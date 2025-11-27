import { relations, sql } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { resumes } from "./resumes";

export const educations = pgTable("educations", {
  id: uuid("id").primaryKey().defaultRandom(),

  degree: varchar("degree", { length: 255 }),
  institution: varchar("school", { length: 255 }),
  startDate: varchar("start_date", { length: 255 }),
  endDate: varchar("end_date", { length: 255 }),

  resumeId: uuid("resume_id")
    .notNull()
    .references(() => resumes.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => sql`CURRENT_TIMESTAMP`
  ),
});

export const educationsRelations = relations(educations, ({ one }) => ({
  resume: one(resumes, {
    fields: [educations.resumeId],
    references: [resumes.id],
  }),
}));
