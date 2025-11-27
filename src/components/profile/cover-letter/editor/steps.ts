import { EditorFormProps } from "@/types/letter";
import { GeneralInfoForm } from "./forms/general-info-form";
import { PersonalInfoForm } from "./forms/personal-info-form";
import { TextForm } from "./forms/text-form";
import { WorkInfoForm } from "./forms/work-info-form";

export type StepKey = "generalInfo" | "personalInfo" | "workInfo" | "text";

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
    titleKey: "workInfo",
    component: WorkInfoForm,
    key: "work-info",
  },
  {
    titleKey: "text",
    component: TextForm,
    key: "text",
  },
];
