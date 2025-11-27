"use client";

import { ForwardedRef, forwardRef, useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { useLetterLogic } from "@/components/profile/cover-letter/hooks/use-letter-logic";
import { DocumentInfo } from "@/components/profile/shared/document-info";
import { PreviewSection } from "@/components/profile/shared/preview/preview";
import { Icon } from "@/components/shared/icon";
import { Loader } from "@/components/shared/loader";
import { Link, useRouter } from "@/i18n/routing";
import { ILetter } from "@/types/letter";
import { formatDate } from "@/utils/date-utils";

type LetterWithDuplicate =
  | ILetter
  | { id: string; title: string; data: ILetter; isDuplicate: boolean };

const PrintPreview = forwardRef(
  ({ letter }: { letter: ILetter }, ref: ForwardedRef<HTMLDivElement>) => (
    <div className="min-h-[297mm] w-[210mm] bg-white" ref={ref}>
      <PreviewSection
        // @ts-expect-error type error
        data={letter}
        template={letter.template || "short"}
        isPrintMode
        componentType="letter"
      />
    </div>
  )
);

PrintPreview.displayName = "PrintPreview";

export const CoverLetterPage = () => {
  const router = useRouter();
  const {
    t,
    locale,
    isLoading,
    allLetters,
    handleTitleChange,
    getLetterData,
    handleDeleteClick,
    handleDuplicateLetter,
  } = useLetterLogic();
  const [currentPrintLetter, setCurrentPrintLetter] = useState<ILetter | null>(
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
    onAfterPrint: () => setCurrentPrintLetter(null),
  });

  useEffect(() => {
    if (currentPrintLetter && componentRef.current && printHandler) {
      printHandler();
    }
  }, [currentPrintLetter, printHandler]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader className="text-gray-400" />
      </div>
    );
  }

  return (
    <>
      {currentPrintLetter && (
        <div style={{ display: "none" }}>
          <PrintPreview ref={componentRef} letter={currentPrintLetter} />
        </div>
      )}
      <div className="min-h-screen bg-white p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <Link
              href="/profile/cover-letter/editor"
              className="flex h-[520px] items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white p-4 transition-colors hover:border-gray-400 lg:h-[320px]"
            >
              <div className="flex items-center gap-2">
                <Icon name="resume-page" size="w-4 h-5" />
                <span>{t("actions.create")}</span>
              </div>
            </Link>

            {allLetters.map((letter: LetterWithDuplicate, i) => (
              <div
                key={letter.id || i}
                className="group relative flex h-[520px] flex-col lg:h-[394px] lg:w-[232px]"
              >
                <div className="relative flex-1 cursor-pointer overflow-y-auto rounded-lg border border-gray-200 transition-shadow hover:shadow-md lg:h-[320px] lg:w-[232px] lg:overflow-hidden">
                  <PreviewSection
                    // @ts-expect-error type error
                    data={getLetterData(letter)}
                    componentType="letter"
                    template={
                      ("data" in letter
                        ? letter.data.template
                        : letter.template) || "short"
                    }
                  />
                </div>
                <div className="flex-shrink-0 p-3">
                  <DocumentInfo
                    className="bottom-[-12px] sm:left-[-55px] md:bottom-[56px] lg:bottom-[58px] lg:left-[-136px]"
                    title={letter.title || ""}
                    lastUpdated={formatDate(
                      "data" in letter
                        ? letter.data.updatedAt
                        : letter.updatedAt,
                      locale
                    )}
                    onDuplicate={() =>
                      handleDuplicateLetter(
                        "data" in letter ? letter.data : letter
                      )
                    }
                    onDeleteClick={() =>
                      handleDeleteClick(
                        letter.id,
                        "isDuplicate" in letter && letter.isDuplicate
                      )
                    }
                    onTitleChange={(newTitle) =>
                      handleTitleChange(letter.id, newTitle)
                    }
                    reactToPrintFn={() => {
                      const letterData =
                        "data" in letter ? letter.data : letter;
                      setCurrentPrintLetter(letterData);
                    }}
                    onEditClick={() => {
                      router.push(
                        `/profile/cover-letter/editor?id=${letter.id}`
                      );
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
