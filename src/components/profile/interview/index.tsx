"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAlert } from "@/contexts/alert-context";
import { InterviewForm } from "./forms/interview-form";
import { InterviewFormValues } from "./forms/schema";
import { InterviewCard } from "./interview-card";
import { useInterviews } from "./use-interviews";

export const Interviewer = () => {
  const t = useTranslations("Interviewer");
  const { showAlert } = useAlert();
  const { interviews, isLoading, pending, create, regenerate, remove } =
    useInterviews();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // undefined = nothing chosen yet, so the first interview starts expanded
  const [expandedKey, setExpandedKey] = useState<string | null | undefined>(
    undefined
  );

  const isExpanded = (key: string, index: number) =>
    expandedKey === undefined ? index === 0 : expandedKey === key;

  const handleSubmit = (data: InterviewFormValues) => {
    setIsDialogOpen(false);
    create(data);
  };

  const handleDelete = (key: string) => {
    showAlert({
      title: t("deleteConfirmTitle"),
      description: t("deleteConfirmDescription"),
      cancelText: t("cancelButton"),
      confirmText: t("deleteButton"),
      loadingText: t("deletingMessage"),
      isLoading: pending?.action === "deleting",
      variant: "destructive",
      onConfirm: async () => {
        const deleted = await remove(key);
        if (deleted && expandedKey === key) setExpandedKey(null);
      },
    });
  };

  return (
    <div className="container mx-auto min-h-[70vh] p-[24px]">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-md">{t("createButton")}</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>{t("createButton")}</DialogTitle>
            </DialogHeader>
            <InterviewForm
              onSubmit={handleSubmit}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            <p>{t("loadingMessage")}</p>
          </div>
        ) : interviews.length === 0 ? (
          <div className="rounded-lg border p-8 text-center">
            <p className="text-muted-foreground">{t("noInterviewsMessage")}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("getStartedMessage")}
            </p>
          </div>
        ) : (
          interviews.map((interview, index) => {
            const expanded = isExpanded(interview.key, index);
            const isCurrent = pending?.key === interview.key;
            return (
              <InterviewCard
                key={interview.key}
                interview={interview}
                expanded={expanded}
                busy={pending !== null}
                isGenerating={isCurrent && pending?.action === "generating"}
                isDeleting={isCurrent && pending?.action === "deleting"}
                onToggle={() => setExpandedKey(expanded ? null : interview.key)}
                onRegenerate={() => regenerate(interview.key)}
                onDelete={() => handleDelete(interview.key)}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
