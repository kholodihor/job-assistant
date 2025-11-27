import { templates } from "@/constants";
import { ResumeData } from "@/types/resume";

export const initialData: ResumeData = {
  title: "",
  template: templates.CLASSIC,
  name: "",
  profession: "",
  photo: "",
  location: "",
  address: "",
  phone: "",
  email: "",
  telegram: "",
  github: "",
  behance: "",
  dribbble: "",
  adobePortfolio: "",
  workExperiences: [],
  educations: [],
  skills: [],
  languages: [],
  summary: "",
};
