import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  MessageSquare,
  RefreshCw,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

interface QuestionNavigationProps {
  currentIndex: number;
  total: number;
  canCheckAnswer: boolean;
  isGeneratingFeedback: boolean;
  onCheckAnswer: () => void;
  onPrevious: () => void;
  onNext: () => void;
  isGenerating: boolean;
  onRegenerate: () => void;
}

export const QuestionNavigation = ({
  currentIndex,
  total,
  canCheckAnswer,
  isGeneratingFeedback,
  onCheckAnswer,
  onPrevious,
  onNext,
  isGenerating,
  onRegenerate,
}: QuestionNavigationProps) => {
  const t = useTranslations("Interviewer");

  return (
    <div className="mt-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium">
          {t("liveInterview.currentQuestion")}:
        </span>
        <span className="text-sm text-muted-foreground">
          {currentIndex + 1} / {total}
        </span>
      </div>

      {canCheckAnswer && (
        <Button
          variant="outline"
          size="sm"
          onClick={onCheckAnswer}
          disabled={isGeneratingFeedback}
          className="mb-3 flex w-full items-center justify-center gap-1"
        >
          {isGeneratingFeedback ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MessageSquare className="h-4 w-4" />
          )}
          {isGeneratingFeedback
            ? t("liveInterview.generatingFeedback")
            : t("liveInterview.checkAnswer")}
        </Button>
      )}

      <div className="mb-3 flex items-center justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevious}
          disabled={total === 0 || currentIndex <= 0}
          className="flex flex-1 items-center justify-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("liveInterview.previousQuestion")}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={total === 0 || currentIndex >= total - 1}
          className="flex flex-1 items-center justify-center gap-1"
        >
          {t("liveInterview.nextQuestion")}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={onRegenerate}
        disabled={isGenerating}
        className="flex w-full items-center justify-center gap-1"
      >
        {isGenerating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCw className="h-4 w-4" />
        )}
        {t("regenerateButton")}
      </Button>
    </div>
  );
};
