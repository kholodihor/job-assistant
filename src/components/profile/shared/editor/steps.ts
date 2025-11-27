import { EducationForm } from "@/components/profile/resume/editor/forms/education-form";
import { GeneralInfoForm } from "@/components/profile/resume/editor/forms/general-info-form";
import { LanguagesForm } from "@/components/profile/resume/editor/forms/languages-form";
import { PersonalInfoForm } from "@/components/profile/resume/editor/forms/personal-info-form";
import { SkillsForm } from "@/components/profile/resume/editor/forms/skills-form";
import { SummaryForm } from "@/components/profile/resume/editor/forms/summary-form";
import { WorkExperienceForm } from "@/components/profile/resume/editor/forms/work-experience-form";
import { EditorFormProps } from "@/types/resume";

export type StepKey =
  | "generalInfo"
  | "personalInfo"
  | "workExperience"
  | "education"
  | "skills"
  | "languages"
  | "summary";

export const steps: {
  titleKey: StepKey;
  component: React.ComponentType<EditorFormProps>;
  key: string;
}[] = [
  {
    titleKey: "generalInfo",
    component: GeneralInfoForm,
    key: "general-info",
  },
  {
    titleKey: "personalInfo",
    component: PersonalInfoForm,
    key: "personal-info",
  },
  {
    titleKey: "workExperience",
    component: WorkExperienceForm,
    key: "work-experience",
  },
  {
    titleKey: "education",
    component: EducationForm,
    key: "education",
  },
  {
    titleKey: "skills",
    component: SkillsForm,
    key: "skills",
  },
  {
    titleKey: "languages",
    component: LanguagesForm,
    key: "languages",
  },
  {
    titleKey: "summary",
    component: SummaryForm,
    key: "summary",
  },
];
