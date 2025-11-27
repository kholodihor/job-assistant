import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { BsStars } from "react-icons/bs";
import { toast } from "sonner";
import { generateTextGemini } from "@/app/actions/generate-text-gemini";
import { useResumeLogic } from "@/components/profile/hooks/use-resume-logic";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { EditorFormProps } from "@/types/letter";

export const TextForm = ({ letterData, setLetterData }: EditorFormProps) => {
  const { allResumes, getResumeData } = useResumeLogic();
  const [isGenerating, setIsGenerating] = useState(false);
  const t = useTranslations("FormLetter");
  const locale = useLocale();
  const MAX_CHARACTERS = 700;

  const resumeData =
    allResumes.length > 0 ? getResumeData(allResumes[0]) : null;

  const handleGenerateText = async () => {
    try {
      setIsGenerating(true);

      // Validate required fields
      const requiredFields = [
        "name",
        "profession",
        "position",
        "company",
        "nameRecipient",
      ] as const;
      const missingFields = requiredFields.filter(
        (field) => !letterData[field]
      );

      if (missingFields.length > 0) {
        throw new Error(
          `${t("validation.required")}: ${missingFields
            .map((field) => t(`fields.${field}`))
            .join(", ")}`
        );
      }

      // We've already validated these fields exist
      const formattedData = {
        fullName: letterData.name,
        profession: letterData.profession,
        position: letterData.position,
        company: letterData.company,
        nameRecipient: letterData.nameRecipient || "",
        positionRecipient: letterData.positionRecipient || "",
        skills: resumeData?.skills || [],
        workExperience: resumeData?.workExperiences || [],
      };

      const text = await generateTextGemini(formattedData, locale);

      if (!text) {
        throw new Error(t("text.emptyResponse"));
      }

      setLetterData({ ...letterData, text });

      toast.success(t("text.successMessage"), {
        description: t("text.success"),
      });
    } catch (error) {
      console.error("Error generating the text:", error);

      if (error instanceof Error && error.message.includes("API key")) {
        toast.error(t("text.apiKeyError"), {
          description: t("text.contactAdmin"),
        });
      } else {
        toast.error(t("text.errorMessage"), {
          description: error instanceof Error ? error.message : t("text.error"),
        });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    if (newText.length <= MAX_CHARACTERS) {
      setLetterData({ ...letterData, text: newText });
    }
  };

  const remainingCharacters = MAX_CHARACTERS - (letterData.text?.length || 0);

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4 p-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">{t("steps.text.title")}</h2>
        <p className="text-sm text-muted-foreground">
          {t("steps.text.description")}
        </p>
      </div>

      <div className="flex items-center justify-center py-4">
        <Button
          onClick={handleGenerateText}
          disabled={isGenerating}
          type="button"
          variant="ai"
          size="sm"
        >
          {isGenerating ? t("text.generating") : t("text.generate")} <BsStars />
        </Button>
      </div>

      <Textarea
        value={letterData.text || ""}
        onChange={handleTextChange}
        placeholder={t("placeholders.description")}
        className="min-h-[200px]"
        disabled={isGenerating}
      />
      <div className="text-sm text-muted-foreground">
        {remainingCharacters} {t("steps.text.counterFinish")}
      </div>
    </div>
  );
};
