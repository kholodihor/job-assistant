import { relations, sql } from "drizzle-orm";
import {
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { educations } from "./educations";
import { users } from "./users";
import { workExperiences } from "./work-experiences";

export const resumes = pgTable("resumes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  title: varchar("title", { length: 255 }),
  name: varchar("name", { length: 255 }),
  profession: text("profession"), // Can be long, keep as text
  photo: varchar("photo", { length: 2048 }),
  publicId: varchar("publicId", { length: 100 }), // URL length
  summary: text("summary"), // Can be long, keep as text
  location: varchar("location", { length: 320 }),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 320 }),
  telegram: varchar("telegram", { length: 255 }),
  github: varchar("github", { length: 255 }),
  linkedin: varchar("linkedin", { length: 255 }),
  behance: varchar("behance", { length: 255 }),
  dribbble: varchar("dribbble", { length: 255 }),
  adobePortfolio: varchar("adobePortfolio", { length: 255 }),
  template: varchar("template", { length: 255 }).notNull(),
  skills: jsonb("skills").$type<string[]>().default([]),
  languages: jsonb("languages")
    .$type<{ language: string; level: string }[]>()
    .default([]),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => sql`CURRENT_TIMESTAMP`
  ),
});

export const resumesRelations = relations(resumes, ({ many, one }) => ({
  educations: many(educations),
  workExperiences: many(workExperiences),
  user: one(users, {
    fields: [resumes.userId],
    references: [users.id],
  }),
}));
