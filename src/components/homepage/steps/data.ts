import { ScreenSize } from "@/hooks/use-media";

interface ISteps {
  img: string;
  step: string;
  title: string;
  description: string;
  width: Record<ScreenSize, number>;
}

export const createStepsData = (t: (key: string) => string): ISteps[] => [
  {
    img: "/images/cover_steps/cv_1.webp",
    step: t("step1.step"),
    title: t("step1.title"),
    description: t("step1.description"),
    width: {
      "2xl": 230,
      xl: 230,
      lg: 230,
      md: 238,
      mb: 230,
    },
  },
  {
    img: "/images/cover_steps/cv_2.webp",
    step: t("step2.step"),
    title: t("step2.title"),
    description: t("step2.description"),
    width: {
      "2xl": 253,
      xl: 252,
      lg: 252,
      md: 261,
      mb: 253,
    },
  },
  {
    img: "/images/cover_steps/cv_3.webp",
    step: t("step3.step"),
    title: t("step3.title"),
    description: t("step3.description"),
    width: {
      "2xl": 260,
      xl: 260,
      lg: 260,
      md: 270,
      mb: 260,
    },
  },
  {
    img: "/images/cover_steps/cv_4.webp",
    step: t("step4.step"),
    title: t("step4.title"),
    description: t("step4.description"),
    width: {
      "2xl": 226,
      xl: 226,
      lg: 226,
      md: 231,
      mb: 226,
    },
  },
];
