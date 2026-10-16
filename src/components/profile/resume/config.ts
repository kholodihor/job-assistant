import { initialData } from "@/components/profile/resume/editor/forms/initialdata";
import { DocumentConfig } from "@/components/profile/shared/document-config";
import { templates } from "@/constants";

const convertPhotoToBase64 = async (photo: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(photo);
  });
};

export const resumeConfig: DocumentConfig<"resume"> = {
  kind: "resume",
  label: "resume",
  endpoint: "/api/resumes",
  route: "/profile/resume",
  namespace: "resume",
  defaultTemplate: templates.CLASSIC,
  duplicatesStorageKey: "resumes",
  draftStorageKey: "resumeData",
  initialData,
  requiredFields: ["name", "profession", "summary", "title", "template"],
  normalize: (resume) => ({
    ...resume,
    workExperiences: resume.workExperiences || [],
    educations: resume.educations || [],
    languages: resume.languages || [],
    skills: resume.skills || [],
  }),
  // Deep copy arrays and ensure proper structure
  buildCopy: (resume, title) => ({
    title,
    name: resume.name || "",
    email: resume.email || "",
    template: resume.template || "classic",
    skills: [...(resume.skills || [])],
    languages: (resume.languages || []).map((lang) => ({
      language: lang.language || "",
      level: lang.level || "",
    })),
    summary: resume.summary || "",
    phone: resume.phone || "",
    address: resume.address || "",
    profession: resume.profession || "",
    location: resume.location || "",
    github: resume.github || "",
    linkedin: resume.linkedin || "",
    behance: resume.behance || "",
    telegram: resume.telegram || "",
    dribbble: resume.dribbble || "",
    adobePortfolio: resume.adobePortfolio || "",
    photo: resume.photo || "",
    educations: (resume.educations || []).map((edu) => ({
      institution: edu.institution || "",
      degree: edu.degree || "",
      startDate: edu.startDate || "",
      endDate: edu.endDate || "",
    })),
    workExperiences: (resume.workExperiences || []).map((exp) => ({
      id: crypto.randomUUID(),
      company: exp.company || "",
      position: exp.position || "",
      startDate: exp.startDate || "",
      endDate: exp.endDate || "",
      description: exp.description || "",
    })),
  }),
  // Upload the photo as base64 if it's a File
  prepareForSave: async (resume) =>
    resume.photo instanceof File
      ? { ...resume, photo: await convertPhotoToBase64(resume.photo) }
      : { ...resume },
  mergeSaved: (prev, saved) =>
    saved.photo && saved.publicId
      ? { ...prev, photo: saved.photo, publicId: saved.publicId }
      : prev,
  messages: {
    loadFailed: "Failed to load resume data",
    saveFailed: "Failed to save resume",
    saveSuccess: "Resume saved successfully",
  },
};
