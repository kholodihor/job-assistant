"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { checkAnswer } from "@/app/actions/check-answer";
import { generateInterview } from "@/app/actions/generate-interview";
import type { InterviewQuestion } from "@/db/schema/interviews";
import { InterviewRecord, saveInterviewQuestions } from "./interview-api";

export interface ChatMessage {
  text: string;
  sender: "user" | "interviewer" | "feedback";
  feedback?: {
    score: number;
    positives: string;
    improvements: string;
    technicalIssues: string;
  };
}

const toFormValues = (interview: InterviewRecord) => ({
  position: interview.jobPosition,
  description: interview.jobDescription,
  yearsOfExperience: String(interview.jobExperience),
  techStack: interview.techStack || [],
});

export function useInterviewSession(id: string) {
  const t = useTranslations("Interviewer");
  const locale = useLocale();

  const [interview, setInterview] = useState<InterviewRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);

  const currentQuestionIndexRef = useRef(currentQuestionIndex);
  currentQuestionIndexRef.current = currentQuestionIndex;
  // Interview ids whose questions are being generated, so a re-run effect
  // (StrictMode, remount) never fires a second Gemini call for the same id.
  const generatingIdsRef = useRef(new Set<string>());

  const questions = interview?.questions ?? null;

  /** Generates questions with Gemini and persists them on the interview. */
  const generateAndSave = useCallback(
    async (target: InterviewRecord): Promise<InterviewQuestion[] | null> => {
      if (generatingIdsRef.current.has(target.id)) return null;
      generatingIdsRef.current.add(target.id);
      try {
        const response = await generateInterview(toFormValues(target), locale);
        try {
          await saveInterviewQuestions(target.id, response.questions);
        } catch (saveError) {
          console.error("Error saving interview questions:", saveError);
        }
        return response.questions;
      } finally {
        generatingIdsRef.current.delete(target.id);
      }
    },
    [locale]
  );

  // Fetch the interview; generate (and persist) questions only if none are stored
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/interviews/${id}`);
        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "Interview not found"
              : "Failed to fetch interview"
          );
        }

        const data: InterviewRecord = await response.json();
        if (cancelled) return;
        setInterview(data);
        setCurrentQuestionIndex(0);
        setIsLoading(false);

        if (data.questions?.length) return;

        setIsGenerating(true);
        try {
          const generated = await generateAndSave(data);
          if (cancelled || !generated) return;
          setInterview((prev) =>
            prev ? { ...prev, questions: generated } : prev
          );
        } catch (genError) {
          console.error("Error generating interview questions:", genError);
        } finally {
          if (!cancelled) setIsGenerating(false);
        }
      } catch (err) {
        console.error("Error fetching interview:", err);
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [id, generateAndSave]);

  // Show the current question as the only interviewer message
  useEffect(() => {
    const question = questions?.[currentQuestionIndex];
    if (question) {
      setMessages([{ text: question.Question, sender: "interviewer" }]);
    }
  }, [questions, currentQuestionIndex]);

  const regenerateQuestions = async () => {
    if (!interview) return;
    setMessages([]);
    setCurrentQuestionIndex(0);
    setIsGenerating(true);
    try {
      const generated = await generateAndSave(interview);
      if (generated) {
        setInterview((prev) =>
          prev ? { ...prev, questions: generated } : prev
        );
      }
    } catch (genError) {
      console.error("Error generating interview questions:", genError);
    } finally {
      setIsGenerating(false);
    }
  };

  const goToNextQuestion = () => {
    if (questions && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (questions && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const addUserAnswer = useCallback((text: string) => {
    setMessages((prev) => [...prev, { text, sender: "user" }]);
  }, []);

  const clearLastAnswer = () => {
    const lastUserIndex = messages.map((m) => m.sender).lastIndexOf("user");
    if (lastUserIndex === -1) return;
    setMessages((prev) => prev.filter((_, index) => index !== lastUserIndex));
  };

  const lastMessage = messages[messages.length - 1];
  const canCheckAnswer = lastMessage?.sender === "user";
  const hasUserAnswer = messages.some((m) => m.sender === "user");

  const checkCurrentAnswer = async () => {
    const question = questions?.[currentQuestionIndex];
    if (!question || !canCheckAnswer) return;
    const questionIndex = currentQuestionIndex;

    try {
      setIsGeneratingFeedback(true);
      const feedback = await checkAnswer(
        question.Question,
        lastMessage.text,
        question.Answer,
        interview?.techStack || [],
        locale
      );

      // The user moved to another question while feedback was pending
      if (currentQuestionIndexRef.current !== questionIndex) return;

      setMessages((prev) => [
        ...prev,
        {
          text: `Score: ${feedback.score}/10\n\nStrengths: ${feedback.positives}\n\nAreas for Improvement: ${feedback.improvements}${feedback.technicalIssues ? `\n\nTechnical Notes: ${feedback.technicalIssues}` : ""}`,
          sender: "feedback",
          feedback,
        },
      ]);
      toast.success(t("liveInterview.feedbackReceived"));
    } catch (feedbackError) {
      console.error("Error getting answer feedback:", feedbackError);
      if (currentQuestionIndexRef.current !== questionIndex) return;
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I could not analyze your answer at this time.",
          sender: "feedback",
        },
      ]);
    } finally {
      setIsGeneratingFeedback(false);
    }
  };

  return {
    interview,
    questions,
    isLoading,
    isGenerating,
    error,
    currentQuestionIndex,
    messages,
    isGeneratingFeedback,
    canCheckAnswer,
    hasUserAnswer,
    goToNextQuestion,
    goToPreviousQuestion,
    regenerateQuestions,
    addUserAnswer,
    clearLastAnswer,
    checkCurrentAnswer,
  };
}
