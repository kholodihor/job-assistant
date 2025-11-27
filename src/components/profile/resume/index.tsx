"use client";

import { ForwardedRef, forwardRef, useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { DocumentInfo } from "@/components/profile/shared/document-info";
import { PreviewSection } from "@/components/profile/shared/preview/preview";
import { Icon } from "@/components/shared/icon";
import { Loader } from "@/components/shared/loader";
import { Link, useRouter } from "@/i18n/routing";
import { IResume } from "@/types/resume";
import { formatDate } from "@/utils/date-utils";
import { useResumeLogic } from "../hooks/use-resume-logic";

type ResumeWithDuplicate =
  | IResume
  | { id: string; title: string; data: IResume; isDuplicate: boolean };

const PrintPreview = forwardRef(
  ({ resume }: { resume: IResume }, ref: ForwardedRef<HTMLDivElement>) => (
    <div className="min-h-[297mm] w-[210mm] bg-white" ref={ref}>
      <PreviewSection
        data={resume}
        template={resume.template || "classic"}
        isPrintMode
        componentType="resume"
      />
    </div>
  )
);

PrintPreview.displayName = "PrintPreview";

export const ResumePage = () => {
  const router = useRouter();
  const {
    t,
    locale,
    isLoading,
    allResumes,
    handleTitleChange,
    getResumeData,
    handleDeleteClick,
    handleDuplicateResume,
  } = useResumeLogic();

  const [currentPrintResume, setCurrentPrintResume] = useState<IResume | null>(
    null
  );
  const componentRef = useRef<HTMLDivElement>(null);

  const printHandler = useReactToPrint({
    contentRef: componentRef,
    pageStyle: `
      @page {
        size: A4;
        margin: 0;
      }
      @media print {
        body {
          margin: 0;
          padding: 0;
        }
      }
    `,
    onAfterPrint: () => setCurrentPrintResume(null),
  });

  useEffect(() => {
    if (currentPrintResume && componentRef.current && printHandler) {
      printHandler();
    }
  }, [currentPrintResume, printHandler]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader className="text-gray-400" />
      </div>
    );
  }

  return (
    <>
      {currentPrintResume && (
        <div style={{ display: "none" }}>
          <PrintPreview ref={componentRef} resume={currentPrintResume} />
        </div>
      )}
      <div className="min-h-screen bg-white p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <Link
              href="/profile/resume/editor"
              className="flex h-[520px] items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white p-4 transition-colors hover:border-gray-400 lg:h-[320px]"
            >
              <div className="flex items-center gap-2">
                <Icon name="resume-page" size="w-4 h-5" />
                <span>{t("actions.create")}</span>
              </div>
            </Link>

            {allResumes.map((resume: ResumeWithDuplicate, i) => (
              <div
                key={resume.id || i}
                className="group relative flex h-[520px] flex-col lg:h-[394px] lg:w-[232px]"
              >
                <div className="relative flex-1 cursor-pointer overflow-y-auto rounded-lg border border-gray-200 transition-shadow hover:shadow-md lg:h-[320px] lg:w-[232px] lg:overflow-hidden">
                  <PreviewSection
                    data={getResumeData(resume)}
                    componentType="resume"
                    template={
                      ("data" in resume
                        ? resume.data.template
                        : resume.template) || "classic"
                    }
                  />
                </div>
                <div className="flex-shrink-0 p-3">
                  <DocumentInfo
                    className="bottom-[-12px] sm:left-[-55px] md:bottom-[56px] lg:bottom-[58px] lg:left-[-136px]"
                    title={resume.title || ""}
                    lastUpdated={formatDate(
                      "data" in resume
                        ? resume.data.updatedAt
                        : resume.updatedAt,
                      locale
                    )}
                    onDuplicate={() =>
                      handleDuplicateResume(
                        "data" in resume ? resume.data : resume
                      )
                    }
                    onDeleteClick={() =>
                      handleDeleteClick(
                        resume.id,
                        "isDuplicate" in resume && resume.isDuplicate
                      )
                    }
                    onTitleChange={(newTitle) =>
                      handleTitleChange(resume.id, newTitle)
                    }
                    reactToPrintFn={() => {
                      const resumeData =
                        "data" in resume ? resume.data : resume;
                      setCurrentPrintResume(resumeData);
                    }}
                    onEditClick={() => {
                      router.push(`/profile/resume/editor?id=${resume.id}`);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
