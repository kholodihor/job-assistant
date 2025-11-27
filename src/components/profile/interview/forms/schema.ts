import { z } from "zod";

export const interviewFormSchema = z.object({
  position: z.string().min(1, "validation.positionRequired"),
  description: z.string().min(1, "validation.descriptionRequired"),
  techStack: z.array(z.string().trim()).optional().default([]),
  yearsOfExperience: z.string().min(1, "validation.yearsRequired"),
});

export type InterviewFormValues = z.infer<typeof interviewFormSchema>;
