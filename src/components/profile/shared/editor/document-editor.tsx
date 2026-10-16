"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import {
  DocumentConfig,
  EditorStep,
} from "@/components/profile/shared/document-config";
import { Breadcrumbs } from "@/components/profile/shared/editor/breadcrumbs";
import { EditorFooter } from "@/components/profile/shared/editor/editor-footer";
import { useDocumentDraft } from "@/components/profile/shared/hooks/use-document-draft";
import { MobilePreview } from "@/components/profile/shared/preview/mobile-preview";
import { PreviewSection } from "@/components/profile/shared/preview/preview";
import { DocumentDataMap, DocumentKind } from "@/types/document";

interface DocumentEditorProps<K extends DocumentKind> {
  config: DocumentConfig<K>;
  steps: EditorStep<DocumentDataMap[K]>[];
}

// Step-by-step editor for a resume or cover letter with a live preview
export const DocumentEditor = <K extends DocumentKind>({
  config,
  steps,
}: DocumentEditorProps<K>) => {
  const searchParams = useSearchParams();
  const documentId = searchParams.get("id");
  const currentStep = searchParams.get("step") || steps[0].key;
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const {
    data,
    updateData,
    saveToDatabase,
    isInitialized,
    isSaving,
    isSavingToDb,
  } = useDocumentDraft(config, documentId || undefined);

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
    [steps, currentStep]
  );

  if (!isInitialized) {
    return null;
  }

  const template = data.template || config.defaultTemplate;

  return (
    <div className="flex w-full flex-col pt-[4rem] lg:pt-0 xl:flex-row">
      <div className="mx-auto flex h-[94vh] w-full flex-col justify-between xl:w-1/2">
        <Breadcrumbs
          kind={config.kind}
          steps={steps}
          currentStep={currentStep}
          setCurrentStep={setStep}
        />
        {FormComponent && (
          <div className="no-scrollbar overflow-y-auto">
            <FormComponent data={data} setData={updateData} />
          </div>
        )}
        <EditorFooter
          kind={config.kind}
          steps={steps}
          currentStep={currentStep}
          setCurrentStep={setStep}
          isSaving={isSaving}
          isSavingToDb={isSavingToDb}
          onSave={saveToDatabase}
          showMobilePreview={showMobilePreview}
          setShowMobilePreview={setShowMobilePreview}
        />
      </div>
      <div className="hidden w-full xl:block xl:w-1/2">
        <PreviewSection kind={config.kind} data={data} template={template} />
      </div>
      {showMobilePreview && (
        <MobilePreview
          kind={config.kind}
          data={data}
          template={template}
          onClose={() => setShowMobilePreview(false)}
        />
      )}
    </div>
  );
};
