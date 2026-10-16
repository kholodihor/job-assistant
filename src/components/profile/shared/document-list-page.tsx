"use client";

import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { DocumentConfig } from "@/components/profile/shared/document-config";
import { DocumentInfo } from "@/components/profile/shared/document-info";
import {
  getStoredDocument,
  useDocumentCollection,
} from "@/components/profile/shared/hooks/use-document-collection";
import { PreviewSection } from "@/components/profile/shared/preview/preview";
import { Icon } from "@/components/shared/icon";
import { Loader } from "@/components/shared/loader";
import { Link, useRouter } from "@/i18n/routing";
import { DocumentKind, StoredDocument } from "@/types/document";
import { formatDate } from "@/utils/date-utils";

// List of the user's resumes or cover letters, with a "create" card
export const DocumentListPage = <K extends DocumentKind>({
  config,
}: {
  config: DocumentConfig<K>;
}) => {
  const router = useRouter();
  const {
    t,
    locale,
    isLoading,
    allDocuments,
    handleTitleChange,
    getDocumentData,
    handleDeleteClick,
    handleDuplicate,
  } = useDocumentCollection(config);

  const [currentPrintDocument, setCurrentPrintDocument] =
    useState<StoredDocument<K> | null>(null);
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
    onAfterPrint: () => setCurrentPrintDocument(null),
  });

  useEffect(() => {
    if (currentPrintDocument && componentRef.current && printHandler) {
      printHandler();
    }
  }, [currentPrintDocument, printHandler]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader className="text-gray-400" />
      </div>
    );
  }

  return (
    <>
      {currentPrintDocument && (
        <div style={{ display: "none" }}>
          <div className="min-h-[297mm] w-[210mm] bg-white" ref={componentRef}>
            <PreviewSection
              kind={config.kind}
              data={currentPrintDocument}
              template={currentPrintDocument.template || config.defaultTemplate}
              isPrintMode
            />
          </div>
        </div>
      )}
      <div className="min-h-screen bg-white p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <Link
              href={`${config.route}/editor`}
              className="flex h-[520px] items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white p-4 transition-colors hover:border-gray-400 lg:h-[320px]"
            >
              <div className="flex items-center gap-2">
                <Icon name="resume-page" size="w-4 h-5" />
                <span>{t("actions.create")}</span>
              </div>
            </Link>

            {allDocuments.map((doc, i) => {
              const stored = getStoredDocument(doc);
              return (
                <div
                  key={doc.id || i}
                  className="group relative flex h-[520px] flex-col lg:h-[394px] lg:w-[232px]"
                >
                  <div className="relative flex-1 cursor-pointer overflow-y-auto rounded-lg border border-gray-200 transition-shadow hover:shadow-md lg:h-[320px] lg:w-[232px] lg:overflow-hidden">
                    <PreviewSection
                      kind={config.kind}
                      data={getDocumentData(doc)}
                      template={stored.template || config.defaultTemplate}
                    />
                  </div>
                  <div className="flex-shrink-0 p-3">
                    <DocumentInfo
                      className="bottom-[-12px] sm:left-[-55px] md:bottom-[56px] lg:bottom-[58px] lg:left-[-136px]"
                      title={doc.title || ""}
                      lastUpdated={formatDate(stored.updatedAt, locale)}
                      onDuplicate={() => handleDuplicate(stored)}
                      onDeleteClick={() =>
                        handleDeleteClick(
                          doc.id,
                          "isDuplicate" in doc && doc.isDuplicate
                        )
                      }
                      onTitleChange={(newTitle) =>
                        handleTitleChange(doc.id, newTitle)
                      }
                      reactToPrintFn={() => setCurrentPrintDocument(stored)}
                      onEditClick={() => {
                        router.push(`${config.route}/editor?id=${doc.id}`);
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
