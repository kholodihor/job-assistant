import { usePathname } from "next/navigation";
import { useMemo, useRef } from "react";
import { A4_WIDTH, MIN_ZOOM, PADDING } from "@/constants";
import useDimensions from "@/hooks/use-dimensions";
import { cn } from "@/lib/utils";
import { DocumentKind } from "@/types/document";
import { DocumentTemplate, PreviewDocument } from "./document-template";

type PreviewSectionProps<K extends DocumentKind> = PreviewDocument<K> & {
  template: string;
  isPrintMode?: boolean;
};

export const PreviewSection = <K extends DocumentKind>({
  kind,
  data,
  template,
  isPrintMode = false,
}: PreviewSectionProps<K>) => {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef);
  const isEditor = pathname?.includes("/editor");

  const zoom = useMemo(() => {
    if (!width) return MIN_ZOOM;
    return Math.max(MIN_ZOOM, (width - PADDING) / A4_WIDTH);
  }, [width]);

  return (
    <div
      className={cn(
        "group relative w-full border-2",
        isEditor ? "hidden md:flex" : "flex"
      )}
      ref={containerRef}
    >
      {isPrintMode ? (
        <div
          className="no-scrollbar flex w-full justify-center overflow-y-auto"
          style={{
            width: "210mm",
            minHeight: "297mm",
            padding: "0",
            backgroundColor: "white",
          }}
        >
          <DocumentTemplate kind={kind} data={data} template={template} />
        </div>
      ) : (
        <div
          className="no-scrollbar flex w-full justify-center overflow-y-auto p-4"
          style={{
            zoom: zoom,
          }}
        >
          <DocumentTemplate kind={kind} data={data} template={template} />
        </div>
      )}
    </div>
  );
};
