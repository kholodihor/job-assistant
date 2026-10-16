"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { generateInterview } from "@/app/actions/generate-interview";
import type { InterviewQuestion } from "@/db/schema/interviews";
import { InterviewFormValues } from "./forms/schema";
import { InterviewRecord, saveInterviewQuestions } from "./interview-api";

export interface InterviewItem extends InterviewFormValues {
  /** Stable React key: the server id, or a client uuid for items created here. */
  key: string;
  /** Server id; undefined until the create request succeeds. */
  id?: string;
  questions?: InterviewQuestion[];
}

export type PendingAction = { key: string; action: "generating" | "deleting" };

const fromRecord = (interview: InterviewRecord): InterviewItem => ({
  key: interview.id,
  id: interview.id,
  position: interview.jobPosition,
  description: interview.jobDescription,
  yearsOfExperience: interview.jobExperience,
  techStack: interview.techStack ?? [],
  questions: interview.questions ?? undefined,
});

export function useInterviews() {
  const locale = useLocale();
  const [interviews, setInterviews] = useState<InterviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pending, setPending] = useState<PendingAction | null>(null);

  const updateItem = useCallback(
    (key: string, patch: Partial<InterviewItem>) =>
      setInterviews((prev) =>
        prev.map((item) => (item.key === key ? { ...item, ...patch } : item))
      ),
    []
  );

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/interviews");
        if (!response.ok || cancelled) return;
        const records: InterviewRecord[] = await response.json();
        if (!cancelled) setInterviews(records.map(fromRecord));
      } catch (error) {
        console.error("Error loading interviews:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  /** Generates questions for an item; returns them, or undefined on failure. */
  const generateFor = async (key: string, data: InterviewFormValues) => {
    try {
      setPending({ key, action: "generating" });
      const { questions } = await generateInterview(data, locale);
      updateItem(key, { questions });
      return questions;
    } catch (error) {
      console.error("Error generating interview:", error);
      return undefined;
    } finally {
      setPending(null);
    }
  };

  const create = async (data: InterviewFormValues) => {
    const key = crypto.randomUUID();
    setInterviews((prev) => [...prev, { ...data, key }]);

    const questions = await generateFor(key, data);

    try {
      const response = await fetch("/api/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, questions }),
      });
      if (response.ok) {
        const saved: InterviewRecord = await response.json();
        updateItem(key, { id: saved.id });
      }
    } catch (error) {
      console.error("Error saving interview to database:", error);
    }
  };

  const regenerate = async (key: string) => {
    const item = interviews.find((i) => i.key === key);
    if (!item) return;
    const questions = await generateFor(key, item);
    if (questions && item.id) {
      try {
        await saveInterviewQuestions(item.id, questions);
      } catch (error) {
        console.error("Error saving interview questions:", error);
      }
    }
  };

  const remove = async (key: string) => {
    const item = interviews.find((i) => i.key === key);
    if (!item?.id) return false;
    try {
      setPending({ key, action: "deleting" });
      const response = await fetch(`/api/interviews/${item.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        console.error("Failed to delete interview");
        return false;
      }
      setInterviews((prev) => prev.filter((i) => i.key !== key));
      return true;
    } catch (error) {
      console.error("Error deleting interview:", error);
      return false;
    } finally {
      setPending(null);
    }
  };

  return { interviews, isLoading, pending, create, regenerate, remove };
}
