import { z } from "zod";

export const interviewQuestionsSchema = z
  .array(
    z.object({
      Question: z.string().max(2000),
      Answer: z.string().max(10000),
    })
  )
  .max(20);

export const updateInterviewSchema = z.object({
  questions: interviewQuestionsSchema,
});
