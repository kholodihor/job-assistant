import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const interviews = pgTable("interviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  jobPosition: text("jobPosition").notNull(),
  jobDescription: text("jobDescription").notNull(),
  jobExperience: text("jobExperience").notNull(),
  techStack: jsonb("skills").$type<string[]>().default([]),
  createdBy: text("createdBy").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
