import { z } from "zod";

export const letterSchema = z.object({
  title: z.string().max(255),
  name: z.string().max(255),
  profession: z.string().optional(),
  position: z.string().optional(),
  company: z.string().max(255),
  location: z.string().max(100).optional(),
  phone: z.string().max(50).optional(),
  email: z.string().email().max(320),
  nameRecipient: z.string().max(255),
  positionRecipient: z.string().optional(),
  text: z.string().optional(),
  template: z.string().max(255),
});
