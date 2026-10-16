import React from "react";
import { useTranslations } from "next-intl";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { DocumentKind } from "@/types/document";

interface BreadcrumbsProps {
  kind: DocumentKind;
  steps: { key: string; titleKey: string }[];
  currentStep: string;
  setCurrentStep: (step: string) => void;
}

export const Breadcrumbs = ({
  kind,
  steps,
  currentStep,
  setCurrentStep,
}: BreadcrumbsProps) => {
  const t = useTranslations(
    kind === "resume" ? "Form.steps" : "FormLetter.steps"
  );

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
