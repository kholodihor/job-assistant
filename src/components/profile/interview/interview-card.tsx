import { Loader2, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import type { InterviewItem } from "./use-interviews";

interface InterviewCardProps {
  interview: InterviewItem;
  expanded: boolean;
  /** Any interview is being generated or deleted (disables actions). */
  busy: boolean;
  isGenerating: boolean;
  isDeleting: boolean;
  onToggle: () => void;
  onRegenerate: () => void;
  onDelete: () => void;
}

export const InterviewCard = ({
  interview,
  expanded,
  busy,
  isGenerating,
  isDeleting,
  onToggle,
  onRegenerate,
  onDelete,
}: InterviewCardProps) => {
  const t = useTranslations("Interviewer");

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{interview.position}</CardTitle>
            <CardDescription>{interview.description}</CardDescription>
            <div className="mt-2 flex flex-wrap gap-1">
              {interview.techStack?.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full bg-primary/10 px-2 py-1 text-xs"
                >
                  {tech}
                </span>
              ))}
              <span className="rounded-full bg-secondary/20 px-2 py-1 text-xs">
                {interview.yearsOfExperience} {t("yearsExp")}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onToggle}
              className="flex items-center gap-1"
            >
              {expanded ? t("collapseButton") : t("expandButton")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onRegenerate}
              disabled={busy}
              className="flex items-center gap-1"
            >
              {isGenerating ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : null}
              {t("regenerateButton")}
            </Button>
            {interview.id && !busy ? (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Link href={`/profile/interview/${interview.id}`}>
                  {t("goLiveButton")}
                </Link>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                disabled
                className="flex items-center gap-1"
              >
                Go Live
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              disabled={busy || !interview.id}
              className="flex items-center gap-1 bg-red-50 hover:bg-red-100 hover:text-red-600"
            >
              {isDeleting ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Trash2 className="h-3 w-3" />
              )}
              {t("deleteButton")}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isGenerating ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            <p>{t("generatingMessage")}</p>
          </div>
        ) : interview.questions && expanded ? (
          <Accordion type="single" collapsible className="w-full">
            {interview.questions.map((q, qIndex) => (
              <AccordionItem key={qIndex} value={`question-${qIndex}`}>
                <AccordionTrigger className="text-left">
                  {q.Question}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p>{q.Answer}</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : interview.questions ? (
          <div className="py-4 text-center text-muted-foreground">
            <p>{t("expandMessage")}</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};
