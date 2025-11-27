import { usePathname } from "next/navigation";
import { useMemo, useRef } from "react";
import { A4_WIDTH, MIN_ZOOM, PADDING } from "@/constants";
import useDimensions from "@/hooks/use-dimensions";
import { cn } from "@/lib/utils";
import { ResumeData } from "@/types/resume";
import {
  renderLetterTemplate,
  renderResumeTemplate,
} from "@/utils/render-template";

interface PreviewSectionProps {
  data: ResumeData;
  template: string;
  componentType: string;
  isPrintMode?: boolean;
}

export const PreviewSection = ({
  data,
  template,
  componentType,
  isPrintMode = false,
}: PreviewSectionProps) => {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef);
  const isEditor = pathname?.includes("/editor");
  const TemplateResumeComponent = renderResumeTemplate(template);
  const TemplateLetterComponent = renderLetterTemplate(template);

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
          {componentType === "resume" ? (
            <TemplateResumeComponent data={data} />
          ) : (
            // @ts-expect-error type error
            <TemplateLetterComponent data={data} />
          )}
        </div>
      ) : (
        <div
          className="no-scrollbar flex w-full justify-center overflow-y-auto p-4"
          style={{
            zoom: zoom,
          }}
        >
          {componentType === "resume" ? (
            <TemplateResumeComponent data={data} />
          ) : (
            // @ts-expect-error type error
            <TemplateLetterComponent data={data} />
          )}
        </div>
      )}
    </div>
  );
};
