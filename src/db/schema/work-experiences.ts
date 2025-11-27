import { relations, sql } from "drizzle-orm";
import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { resumes } from "./resumes";

export const workExperiences = pgTable("work_experiences", {
  id: uuid("id").primaryKey().defaultRandom(),

  position: varchar("position", { length: 255 }),
  company: varchar("company", { length: 255 }),
  startDate: varchar("start_date", { length: 255 }),
  endDate: varchar("end_date", { length: 255 }),
  description: text("description"), // Can be long, keep as text

  resumeId: uuid("resume_id")
    .notNull()
    .references(() => resumes.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => sql`CURRENT_TIMESTAMP`
  ),
});

export const workExperiencesRelations = relations(
  workExperiences,
  ({ one }) => ({
    resume: one(resumes, {
      fields: [workExperiences.resumeId],
      references: [resumes.id],
    }),
  })
);
