import { z } from "zod";
import { lettersTemplates } from "@/constants";

export const generalInfoSchema = z.object({
  title: z.string().min(1, "validation.titleRequired"),
  template: z.enum([lettersTemplates.SHORT, lettersTemplates.DETAILED], {
    required_error: "validation.templateRequired",
  }),
});

export const personalInfoSchema = z.object({
  name: z.string().min(1, "validation.nameRequired"),
  profession: z.string().min(1, "validation.professionRequired"),
  position: z.string().min(1, "validation.positionRequired"),
  location: z.string().min(1, "validation.locationRequired"),
  phone: z.string().min(1, "validation.phoneRequired"),
  email: z.string().email("validation.invalidEmail"),
  company: z.string().min(1, "validation.companyRequired"),
  nameRecipient: z.string().min(1, "validation.nameRecipientRequired"),
  positionRecipient: z.string().min(1, "validation.positionRecipientRequired"),
});

export const textSchema = z.object({
  text: z.string().optional().default(""),
});

export const letterSchema = z.object({
  ...generalInfoSchema.shape,
  ...personalInfoSchema.shape,
  ...textSchema.shape,
});

// export type LetterValues = Omit<z.infer<typeof letterSchema>, "photo"> & {
//   id?: string;
//   photo?: File | string | null;
// };

export type GeneralInfoFormValues = z.infer<typeof generalInfoSchema>;
export type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;
export const workInfoSchema = z.object({
  profession: z.string().min(1, "validation.professionRequired"),
  position: z.string().min(1, "validation.positionRequired"),
  company: z.string().min(1, "validation.companyRequired"),
  nameRecipient: z.string().min(1, "validation.nameRecipientRequired"),
  positionRecipient: z.string().min(1, "validation.positionRecipientRequired"),
});

export type TextValues = z.infer<typeof textSchema>;
export type WorkInfoFormValues = z.infer<typeof workInfoSchema>;
