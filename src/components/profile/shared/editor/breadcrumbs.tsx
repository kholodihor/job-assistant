import React from "react";
import { useTranslations } from "next-intl";
import { steps as letterSteps } from "@/components/profile/cover-letter/editor/steps";
import { steps as resumeSteps } from "@/components/profile/shared/editor/steps";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbsProps {
  componentType: string;
  currentStep: string;
  setCurrentStep: (step: string) => void;
}

export const Breadcrumbs = ({
  componentType,
  currentStep,
  setCurrentStep,
}: BreadcrumbsProps) => {
  const t = useTranslations(
    componentType === "resume" ? "Form.steps" : "FormLetter.steps"
  );
  const steps = componentType === "resume" ? resumeSteps : letterSteps;

  return (
    <div className="flex justify-center px-2">
      <Breadcrumb>
        <BreadcrumbList>
          {steps.map((step) => (
            <React.Fragment key={step.key}>
              <BreadcrumbItem>
                {step.key === currentStep ? (
                  <BreadcrumbPage>{t(`${step.titleKey}.title`)}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <button onClick={() => setCurrentStep(step.key)}>
                      {t(`${step.titleKey}.title`)}
                    </button>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              <BreadcrumbSeparator className="last:hidden" />
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};
