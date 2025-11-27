import { DetailedTemplate } from "@/components/profile/cover-letter/templates/detailed-template";
import { ShortTemplate } from "@/components/profile/cover-letter/templates/short-template";
import { ClassicTemplate } from "@/components/profile/resume/templates/classic-template";
import { ModernDarkTemplate } from "@/components/profile/resume/templates/modern-dark-template";

export const renderResumeTemplate = (template: string) => {
  switch (template) {
    case "classic":
      return ClassicTemplate;
    case "modern-dark":
      return ModernDarkTemplate;
    default:
      return ClassicTemplate;
  }
};

export const renderLetterTemplate = (template: string) => {
  switch (template) {
    case "detailed":
      return DetailedTemplate;
    case "short":
      return ShortTemplate;
    default:
      return ShortTemplate;
  }
};
