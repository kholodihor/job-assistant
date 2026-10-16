import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/** A generated interview question with its sample answer (shape returned by Gemini). */
export interface InterviewQuestion {
  Question: string;
  Answer: string;
}

export const interviews = pgTable("interviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  jobPosition: text("jobPosition").notNull(),
  jobDescription: text("jobDescription").notNull(),
  jobExperience: text("jobExperience").notNull(),
  techStack: jsonb("skills").$type<string[]>().default([]),
  questions: jsonb("questions").$type<InterviewQuestion[]>(),
  createdBy: text("createdBy").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
