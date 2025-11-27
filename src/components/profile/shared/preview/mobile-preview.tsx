import Image from "next/image";
import { useTranslations } from "next-intl";
import { ResumeData } from "@/types/resume";
import {
  renderLetterTemplate,
  renderResumeTemplate,
} from "@/utils/render-template";

interface MobilePreviewProps {
  data: ResumeData;
  template: string;
  onClose: () => void;
  componentType: string;
}

export const MobilePreview = ({
  componentType,
  data,
  template,
  onClose,
}: MobilePreviewProps) => {
  const t = useTranslations(
    componentType === "resume" ? "ResumePage" : "CoverLetterPage"
  );

  return (
    <div className="absolute left-0 top-0 z-50 h-full w-full bg-white/70 backdrop-blur-sm xl:hidden">
      {/* Header */}
      <div className="sticky top-0 z-10 flex h-14 items-center justify-between bg-white px-4 shadow-sm">
        <h2 className="text-lg font-medium text-black-900">{t("preview")}</h2>
        <button
          onClick={onClose}
          className="hover:bg-black-50 flex h-10 w-10 items-center justify-center rounded-full"
          aria-label={t("close")}
        >
          <div className="relative h-6 w-6">
            <Image src="/icons/exit.svg" alt={t("close")} fill />
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="no-scrollbar h-[calc(100vh-56px)] overflow-y-auto">
        <div className="mx-auto flex justify-center p-3">
          <div className="w-full max-w-[800px]">
            {componentType === "resume"
              ? renderResumeTemplate(template)({ data: data })
              : // @ts-expect-error type error
                renderLetterTemplate(template)({ data: data })}
          </div>
        </div>
      </div>
    </div>
  );
};
