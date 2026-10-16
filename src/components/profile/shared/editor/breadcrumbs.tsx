import React from "react";
import { useTranslations } from "next-intl";
import { DocumentI18n } from "@/components/profile/shared/document-config";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbsProps {
  i18n: DocumentI18n;
  steps: { key: string; titleKey: string }[];
  currentStep: string;
  setCurrentStep: (step: string) => void;
}

export const Breadcrumbs = ({
  i18n,
  steps,
  currentStep,
  setCurrentStep,
}: BreadcrumbsProps) => {
  const t = useTranslations(i18n.steps);

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
