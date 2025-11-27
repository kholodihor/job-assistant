import { FileUserIcon, PenLineIcon, Save } from "lucide-react";
import { useTranslations } from "next-intl";
import { steps as letterSteps } from "@/components/profile/cover-letter/editor/steps";
import { steps as resumeSteps } from "@/components/profile/shared/editor/steps";
import { Button } from "@/components/ui/button";

interface FooterProps {
  componentType: string;
  currentStep: string;
  setCurrentStep: (step: string) => void;
  showMobileResumePreview: boolean;
  setShowMobileResumePreview: (show: boolean) => void;
  isSaving?: boolean;
  isSavingToDb?: boolean;
  onSave?: () => void;
}

export const EditorFooter = ({
  componentType,
  currentStep,
  setCurrentStep,
  showMobileResumePreview,
  setShowMobileResumePreview,
  isSaving,
  isSavingToDb,
  onSave,
}: FooterProps) => {
  const t = useTranslations(
    componentType === "resume" ? "Form.navigation" : "FormLetter.navigation"
  );
  const steps = componentType === "resume" ? resumeSteps : letterSteps;

  const previousStep = steps.find(
    (_, index) => steps[index + 1]?.key === currentStep
  )?.key;

  const nextStep = steps.find(
    (_, index) => steps[index - 1]?.key === currentStep
  )?.key;

  return (
    <footer className="sticky bottom-0 w-full border-t bg-white p-3 shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 sm:flex-row sm:items-center">
        {/* Navigation Buttons */}
        <div className="flex flex-1 items-center gap-2 sm:gap-3">
          <Button
            variant="secondary"
            className="min-w-[100px] flex-1 transition-colors hover:bg-blue-100/50 sm:flex-initial"
            onClick={
              previousStep ? () => setCurrentStep(previousStep) : undefined
            }
            disabled={!previousStep}
          >
            {t("previousStep")}
          </Button>
          <Button
            className="min-w-[100px] flex-1 transition-colors hover:bg-blue-100/50 sm:flex-initial"
            onClick={nextStep ? () => setCurrentStep(nextStep) : undefined}
            disabled={!nextStep}
          >
            {t("nextStep")}
          </Button>
        </div>

        {/* Status and Actions */}
        <div className="flex items-center justify-end gap-2 sm:gap-3">
          {isSaving && (
            <span className="text-sm text-gray-500 sm:ml-4">{t("saving")}</span>
          )}

          {onSave && (currentStep === "summary" || currentStep === "text") && (
            <Button
              onClick={onSave}
              disabled={isSavingToDb}
              className="flex min-w-[120px] items-center justify-center gap-2 transition-colors hover:bg-blue-100/50"
            >
              <Save className="h-4 w-4" />
              {componentType === "resume" ? (
                <span className="hidden sm:inline">
                  {isSavingToDb ? t("saving") : t("saveResume")}
                </span>
              ) : (
                <span className="hidden sm:inline">
                  {isSavingToDb ? t("saving") : t("saveLetter")}
                </span>
              )}
              <span className="sm:hidden">
                {isSavingToDb ? t("saving") : t("save")}
              </span>
            </Button>
          )}

          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowMobileResumePreview(!showMobileResumePreview)}
            className="h-10 w-10 xl:hidden"
            title={t("togglePreview")}
          >
            {showMobileResumePreview ? (
              <PenLineIcon className="h-4 w-4" />
            ) : (
              <FileUserIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </footer>
  );
};
