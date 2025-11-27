import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { BsStars } from "react-icons/bs";
import { toast } from "sonner";
import { generateSummaryGemini } from "@/app/actions/generate-summary-gemini";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { EditorFormProps } from "@/types/resume";

export const SummaryForm = ({ resumeData, setResumeData }: EditorFormProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const t = useTranslations("Form");
  const locale = useLocale();

  const handleGenerateSummary = async () => {
    try {
      setIsGenerating(true);

      if (
        !resumeData.name ||
        !resumeData.profession ||
        !resumeData.skills ||
        !resumeData.workExperiences ||
        !resumeData.educations
      ) {
        throw new Error(t("validation.required"));
      }

      const formattedData = {
        fullName: resumeData.name,
        position: resumeData.profession,
        skills: resumeData.skills,
        experience: resumeData.workExperiences.map((exp) => ({
          position: exp.position || "",
          company: exp.company || "",
          description: exp.description || "",
        })),
        education: resumeData.educations.map((edu) => ({
          degree: edu.degree || "",
          institution: edu.institution || "",
        })),
      };

      const summary = await generateSummaryGemini(formattedData, locale);
      setResumeData({ ...resumeData, summary });

      toast.success(t("summary.successMessage"), {
        description: t("summary.success"),
      });
    } catch (error) {
      console.error("Error generating summary:", error);
      toast.error(t("summary.errorMessage"), {
        description:
          error instanceof Error ? error.message : t("summary.error"),
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4 p-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">{t("steps.summary.title")}</h2>
        <p className="text-sm text-muted-foreground">
          {t("steps.summary.description")}
        </p>
      </div>

      <div className="flex items-center justify-center py-4">
        <Button
          onClick={handleGenerateSummary}
          disabled={isGenerating}
          type="button"
          variant="ai"
          size="sm"
        >
          {isGenerating ? t("summary.generating") : t("summary.generate")}{" "}
          <BsStars />
        </Button>
      </div>

      <Textarea
        value={resumeData.summary || ""}
        onChange={(e) =>
          setResumeData({ ...resumeData, summary: e.target.value })
        }
        placeholder={t("placeholders.description")}
        className="min-h-[200px]"
      />
    </div>
  );
};
