/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from "react";
import { useReactToPrint } from "react-to-print";
import { PreviewSection } from "@/components/profile/shared/preview/preview";
import { ILetter } from "@/types/letter";

interface PrintPreviewProps {
  letter: ILetter;
  onPrintComplete: () => void;
}

const PrintContent = React.forwardRef<HTMLDivElement, { letter: ILetter }>(
  ({ letter }, ref) => (
    <div
      ref={ref}
      style={{
        width: "210mm",
        minHeight: "297mm",
        backgroundColor: "white",
      }}
    >
      <PreviewSection
        // @ts-expect-error type error
        data={letter}
        template={letter.template || "short"}
        componentType="letter"
        isPrintMode
      />
    </div>
  )
);

PrintContent.displayName = "PrintContent";

export const PrintPreview: React.FC<PrintPreviewProps> = ({
  letter,
  onPrintComplete,
}) => {
  const contentRef = React.useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    documentTitle: letter.title || letter.name || "Letter",
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

  return <PrintContent ref={contentRef} letter={letter} />;
};
