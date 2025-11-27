"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { useResumeData } from "@/components/profile/hooks/use-resume-data";
import { Breadcrumbs } from "@/components/profile/shared/editor/breadcrumbs";
import { EditorFooter } from "@/components/profile/shared/editor/editor-footer";
import { steps } from "@/components/profile/shared/editor/steps";
import { MobilePreview } from "@/components/profile/shared/preview/mobile-preview";
import { PreviewSection } from "@/components/profile/shared/preview/preview";
import { templates } from "@/constants";

export const ResumeEditor = () => {
  const searchParams = useSearchParams();
  const resumeId = searchParams.get("id");
  const currentStep = searchParams.get("step") || steps[0].key;
  const [showMobileResumePreview, setShowMobileResumePreview] = useState(false);
  const {
    resumeData,
    updateResumeData,
    saveToDatabase,
    isInitialized,
    isSaving,
    isSavingToDb,
  } = useResumeData(resumeId || undefined);

  const setStep = useCallback(
    (key: string) => {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("step", key);
      window.history.pushState(null, "", `?${newSearchParams.toString()}`);
    },
    [searchParams]
  );

  const FormComponent = useMemo(
    () => steps.find((step) => step.key === currentStep)?.component,
    [currentStep]
  );

  if (!isInitialized) {
    return null;
  }

  return (
    <div className="flex w-full flex-col pt-[4rem] lg:pt-0 xl:flex-row">
      <div className="mx-auto flex h-[94vh] w-full flex-col justify-between xl:w-1/2">
        <Breadcrumbs
          componentType="resume"
          currentStep={currentStep}
          setCurrentStep={setStep}
        />
        {FormComponent && (
          <div className="no-scrollbar overflow-y-auto">
            <FormComponent
              resumeData={resumeData}
              setResumeData={updateResumeData}
            />
          </div>
        )}
        <EditorFooter
          componentType="resume"
          currentStep={currentStep}
          setCurrentStep={setStep}
          isSaving={isSaving}
          isSavingToDb={isSavingToDb}
          onSave={saveToDatabase}
          showMobileResumePreview={showMobileResumePreview}
          setShowMobileResumePreview={setShowMobileResumePreview}
        />
      </div>
      <div className="hidden w-full xl:block xl:w-1/2">
        <PreviewSection
          componentType={"resume"}
          data={resumeData}
          template={resumeData.template || templates.CLASSIC}
        />
      </div>
      {showMobileResumePreview && (
        <MobilePreview
          componentType={"resume"}
          data={resumeData}
          template={resumeData.template || templates.CLASSIC}
          onClose={() => setShowMobileResumePreview(false)}
        />
      )}
    </div>
  );
};
