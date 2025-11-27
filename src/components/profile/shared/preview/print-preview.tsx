/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from "react";
import { useReactToPrint } from "react-to-print";
import { IResume } from "@/types/resume";
import { PreviewSection } from "./preview";

interface PrintPreviewProps {
  resume: IResume;
  onPrintComplete: () => void;
}

const PrintContent = React.forwardRef<HTMLDivElement, { resume: IResume }>(
  ({ resume }, ref) => (
    <div
      ref={ref}
      style={{
        width: "210mm",
        minHeight: "297mm",
        backgroundColor: "white",
      }}
    >
      <PreviewSection
        data={resume}
        template={resume.template || "classic"}
        componentType="resume"
        isPrintMode
      />
    </div>
  )
);

PrintContent.displayName = "PrintContent";

export const PrintPreview: React.FC<PrintPreviewProps> = ({
  resume,
  onPrintComplete,
}) => {
  const contentRef = React.useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    documentTitle: resume.title || resume.name || "Resume",
    //@ts-expect-error
    content: () => contentRef.current,
    onAfterPrint: onPrintComplete,
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
  });

  React.useEffect(() => {
    if (contentRef.current) {
      handlePrint();
    }
  }, [handlePrint]);

  return <PrintContent ref={contentRef} resume={resume} />;
};
