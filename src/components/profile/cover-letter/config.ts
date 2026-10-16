import { initialData } from "@/components/profile/cover-letter/editor/forms/initialdata";
import { DocumentConfig } from "@/components/profile/shared/document-config";
import { lettersTemplates } from "@/constants";

export const letterConfig: DocumentConfig<"letter"> = {
  kind: "letter",
  label: "letter",
  endpoint: "/api/letters",
  route: "/profile/cover-letter",
  namespace: "letter",
  defaultTemplate: lettersTemplates.SHORT,
  duplicatesStorageKey: "letters",
  draftStorageKey: "letterData",
  initialData,
  requiredFields: [
    "name",
    "profession",
    "position",
    "company",
    "text",
    "title",
    "template",
  ],
  normalize: (letter) => ({ ...letter }),
  buildCopy: (letter, title) => ({
    title,
    name: letter.name || "",
    email: letter.email || "",
    template: letter.template || "short",
    text: letter.text || "",
    phone: letter.phone || "",
    profession: letter.profession || "",
    position: letter.position || "",
    location: letter.location || "",
    company: letter.company || "",
    nameRecipient: letter.nameRecipient || "",
    positionRecipient: letter.positionRecipient || "",
  }),
  // Ensure all required fields are included
  prepareForSave: (letter) => ({
    ...letter,
    name: letter.name || "",
    profession: letter.profession || "",
    position: letter.position || "",
    company: letter.company || "",
    text: letter.text || "",
    title: letter.title || "",
    template: letter.template || "short",
    nameRecipient: letter.nameRecipient || "",
    positionRecipient: letter.positionRecipient || "",
  }),
  mergeSaved: (prev, saved) =>
    saved.publicId ? { ...prev, publicId: saved.publicId } : prev,
  messages: {
    loadFailed: "letter.messages.loadFailed",
    saveFailed: "letter.messages.saveFailed",
    saveSuccess: "letter.messages.saveSuccess",
  },
};
