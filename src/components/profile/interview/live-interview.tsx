"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Eraser,
  Loader2,
  MessageSquare,
  Mic,
  MicOff,
  RefreshCw,
  WebcamIcon,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import useSpeechToText from "react-hook-speech-to-text";
import Webcam from "react-webcam";
import { toast } from "sonner";
import { checkAnswer } from "@/app/actions/check-answer";
import { generateInterview } from "@/app/actions/generate-interview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface InterviewData {
  mockId: string;
  jobPosition: string;
  jobDescription: string;
  jobExperience: number;
  techStack: string[];
  questions?: {
    Question: string;
    Answer: string;
  }[];
}

export const LiveInterview = ({ id }: { id: string }) => {
  const t = useTranslations("Interviewer"); // Used for translations
  const router = useRouter();

  const [interview, setInterview] = useState<InterviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [intError, setIntError] = useState<string | null>(null);

  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [messages, setMessages] = useState<
    {
      text: string;
      sender: "user" | "interviewer" | "feedback";
      feedback?: {
        score: number;
        positives: string;
        improvements: string;
        technicalIssues: string;
      };
    }[]
  >([]);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);

  const locale = useLocale();

  const checkAnswerAndAddFeedback = useCallback(
    async (question: string, answer: string, expectedAnswer: string) => {
      try {
        setIsGeneratingFeedback(true);
        const feedback = await checkAnswer(
          question,
          answer,
          expectedAnswer,
          interview?.techStack || [],
          locale
        );

        setMessages((prev) => [
          ...prev,
          {
            text: `Score: ${feedback.score}/10\n\nStrengths: ${feedback.positives}\n\nAreas for Improvement: ${feedback.improvements}${feedback.technicalIssues ? `\n\nTechnical Notes: ${feedback.technicalIssues}` : ""}`,
            sender: "feedback",
            feedback,
          },
        ]);
        toast.success(t("liveInterview.feedbackReceived"));
      } catch (error) {
        console.error("Error getting answer feedback:", error);
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
    },
    [interview?.techStack, setMessages, locale, t]
  );

  const {
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
    speechRecognitionProperties: {
      lang: locale === "ua" ? "uk-UA" : "en-US",
    },
  });

  // Effect to handle speech-to-text results
  useEffect(() => {
    if (!isRecording && results.length > 0) {
      // Get the latest result and add it to chat when recording stops
      const latestResult = results[results.length - 1];
      const transcript =
        typeof latestResult === "string"
          ? latestResult
          : latestResult.transcript;
      if (transcript?.trim()) {
        const userAnswer = transcript.trim();
        setMessages((prev) => [...prev, { text: userAnswer, sender: "user" }]);
      }
    }
  }, [isRecording, results]);

  // Function to generate questions for the interview
  const generateQuestionsForInterview = useCallback(
    async (interviewData: InterviewData) => {
      if (!interviewData) return;

      try {
        setIsGenerating(true);

        // Format the data for the generate function
        const formData = {
          position: interviewData.jobPosition,
          description: interviewData.jobDescription,
          yearsOfExperience: String(interviewData.jobExperience), // Convert to string to match expected type
          techStack: interviewData.techStack || [],
        };

        // Generate questions using the server action
        const response = await generateInterview(formData, locale);

        // Update the interview with the generated questions
        setInterview((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            questions: response.questions,
          };
        });

        // Initialize the first question in the chat
        if (response.questions && response.questions.length > 0) {
          setMessages([
            {
              text: response.questions[0].Question,
              sender: "interviewer",
            },
          ]);
          setCurrentQuestionIndex(0);
        }
      } catch (error) {
        console.error("Error generating interview questions:", error);
      } finally {
        setIsGenerating(false);
      }
    },
    [
      locale,
      setInterview,
      setMessages,
      setCurrentQuestionIndex,
      setIsGenerating,
    ]
  ); // Add all dependencies

  // Update messages when current question changes
  useEffect(() => {
    if (interview?.questions && interview.questions[currentQuestionIndex]) {
      // Set the current question as the only interviewer message
      setMessages([
        {
          text: interview.questions[currentQuestionIndex].Question,
          sender: "interviewer",
        },
      ]);
    }
  }, [interview?.questions, currentQuestionIndex]);

  // Fetch interview data by ID
  useEffect(() => {
    const fetchInterview = async () => {
      try {
        setIsLoading(true);
        setIntError(null);

        const response = await fetch(`/api/interviews/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Interview not found");
          } else {
            throw new Error("Failed to fetch interview");
          }
        }

        const data = await response.json();
        setInterview(data);

        // Check if we have questions, if not generate them
        if (!data.questions || data.questions.length === 0) {
          await generateQuestionsForInterview(data);
        } else {
          // Set the current question index to 0 (first question)
          setCurrentQuestionIndex(0);
          // The message will be set by the effect that watches currentQuestionIndex
        }
      } catch (err) {
        console.error("Error fetching interview:", err);
        setIntError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterview();
  }, [id, generateQuestionsForInterview]);

  // Function to regenerate questions
  const handleRegenerateQuestions = async () => {
    if (!interview) return;

    // Reset the chat and question index
    setMessages([]);
    setCurrentQuestionIndex(0);

    // Generate new questions
    await generateQuestionsForInterview(interview);
  };

  // Timer for interview duration
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (webcamEnabled) {
      timer = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [webcamEnabled]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Function to navigate to the next question
  const handleNextQuestion = () => {
    if (
      interview?.questions &&
      currentQuestionIndex < interview.questions.length - 1
    ) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
    }
  };

  // Function to navigate to the previous question
  const handlePreviousQuestion = () => {
    if (interview?.questions && currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIndex);
    }
  };

  // Function to clear the last user answer
  const clearLastAnswer = () => {
    if (messages.length > 0) {
      // Find the last user message
      for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].sender === "user") {
          // Remove this message
          setMessages((prev) => prev.filter((_, index) => index !== i));
          break;
        }
      }
    }
  };

  const handleEndInterview = () => {
    // Navigate back to the interviews list
    router.push("/profile/interview");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center py-12">
        <Loader2 className="mb-4 h-8 w-8 animate-spin" />
        <p>{t("loadingMessage")}</p>
      </div>
    );
  }

  if (intError) {
    return (
      <div className="container mx-auto py-12 text-center">
        <div className="inline-block rounded-lg border border-red-200 bg-red-50 p-6">
          <h2 className="mb-2 text-xl font-semibold text-red-700">
            {t("liveInterview.errorTitle")}
          </h2>
          <p className="text-red-600">{intError}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.push("/profile/interview")}
          >
            {t("liveInterview.returnButton")}
          </Button>
        </div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="container mx-auto py-12 text-center">
        <div className="inline-block rounded-lg border border-amber-200 bg-amber-50 p-6">
          <h2 className="mb-2 text-xl font-semibold text-amber-700">
            {t("liveInterview.notFoundTitle")}
          </h2>
          <p className="text-amber-600">
            {t("liveInterview.notFoundDescription")}
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.push("/profile/interview")}
          >
            {t("liveInterview.returnButton")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-[24px]">
      <Card>
        <CardHeader className="bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">
                {t("liveInterview.title")}
              </CardTitle>
              <p className="mt-1 text-muted-foreground">
                {interview.jobPosition}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatTime(elapsedTime)}
              </Badge>
              <Badge variant="secondary">Interview #{id}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col space-y-4">
              <div className="flex aspect-video items-center justify-center overflow-hidden rounded-lg border bg-muted/20">
                {webcamEnabled ? (
                  <Webcam
                    audio={isRecording}
                    onUserMedia={() => setWebcamEnabled(true)}
                    onUserMediaError={() => setWebcamEnabled(false)}
                    mirrored={true}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-4 p-6 text-center">
                    <WebcamIcon className="h-24 w-24 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      {t("liveInterview.cameraDisabled")}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant={webcamEnabled ? "default" : "outline"}
                  onClick={() => setWebcamEnabled(!webcamEnabled)}
                  className="flex-1"
                >
                  <WebcamIcon className="mr-2 h-4 w-4" />
                  {webcamEnabled
                    ? t("liveInterview.disableCamera")
                    : t("liveInterview.enableCamera")}
                </Button>
                <Button
                  variant={isRecording ? "default" : "outline"}
                  className="flex-1"
                  onClick={isRecording ? stopSpeechToText : startSpeechToText}
                  disabled={!webcamEnabled}
                  title={
                    !webcamEnabled ? t("liveInterview.micDisabled") : undefined
                  }
                >
                  {isRecording ? (
                    <Mic className="mr-2 h-4 w-4" />
                  ) : (
                    <MicOff className="mr-2 h-4 w-4" />
                  )}
                  {isRecording
                    ? t("liveInterview.stopRecording")
                    : t("liveInterview.startRecording")}
                  {interimResult && isRecording && (
                    <div className="absolute -bottom-6 left-0 right-0 text-xs text-muted-foreground">
                      <div className="rounded-md border bg-background/95 p-2 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60">
                        {interimResult}
                      </div>
                    </div>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={clearLastAnswer}
                  className="flex-1"
                  disabled={!messages.some((m) => m.sender === "user")}
                >
                  <Eraser className="mr-2 h-4 w-4" />
                  {t("liveInterview.clearAnswer")}
                </Button>
              </div>

              {/* Interview details */}
              <div className="rounded-lg border bg-muted/5 p-4">
                <h3 className="mb-2 font-medium">
                  {t("liveInterview.interviewDetails")}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t("liveInterview.position")}:
                    </span>
                    <span className="font-medium">{interview.jobPosition}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t("liveInterview.experience")}:
                    </span>
                    <span className="font-medium">
                      {interview.jobExperience} years
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t("liveInterview.techStack")}:
                    </span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {interview.techStack?.map((tech, i) => (
                        <span
                          key={i}
                          className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex h-full flex-col">
              <div className="max-h-[400px] flex-1 overflow-y-auto rounded-lg border bg-muted/10 p-4">
                <h3 className="mb-4 flex items-center font-medium">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  {t("liveInterview.interviewChat")}
                </h3>
                <Separator className="my-2" />

                <div className="space-y-4">
                  {/* Chat messages */}
                  {messages.map((msg, i) => (
                    <div key={i} className="flex flex-col">
                      <div
                        className={`${
                          msg.sender === "user"
                            ? "text-black self-end bg-blue-100"
                            : msg.sender === "feedback"
                              ? "text-black self-start border border-green-200 bg-green-50"
                              : "text-black self-start bg-blue-50"
                        } inline-block max-w-[80%] rounded-lg p-3`}
                      >
                        <p className="text-sm font-medium">
                          {msg.sender === "user"
                            ? "You"
                            : msg.sender === "feedback"
                              ? "AI Feedback"
                              : "Interviewer"}
                        </p>
                        <p>{msg.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Show loading indicator when generating questions */}
                {isGenerating && (
                  <div className="mt-4 flex items-center justify-center rounded-lg border border-blue-100 bg-blue-50 p-3">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-blue-600" />
                    <p className="text-sm text-blue-700">
                      {t("generatingQuestionsMessage") ||
                        "Generating interview questions..."}
                    </p>
                  </div>
                )}
              </div>

              {/* Question navigation buttons */}
              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {t("liveInterview.currentQuestion") || "Current Question"}:
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {currentQuestionIndex + 1} /{" "}
                    {interview.questions?.length || 0}
                  </span>
                </div>

                {messages.length > 0 &&
                  messages[messages.length - 1].sender === "user" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (
                          interview?.questions &&
                          interview.questions[currentQuestionIndex]
                        ) {
                          const currentQuestion =
                            interview.questions[currentQuestionIndex];
                          checkAnswerAndAddFeedback(
                            currentQuestion.Question,
                            messages[messages.length - 1].text,
                            currentQuestion.Answer
                          );
                        }
                      }}
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
                    onClick={handlePreviousQuestion}
                    disabled={
                      !interview?.questions || currentQuestionIndex <= 0
                    }
                    className="flex flex-1 items-center justify-center gap-1"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    {t("liveInterview.previousQuestion") || "Previous Question"}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextQuestion}
                    disabled={
                      !interview?.questions ||
                      currentQuestionIndex >= interview.questions.length - 1
                    }
                    className="flex flex-1 items-center justify-center gap-1"
                  >
                    {t("liveInterview.nextQuestion") || "Next Question"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>

                {/* Regenerate Questions button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRegenerateQuestions}
                  disabled={isGenerating}
                  className="flex w-full items-center justify-center gap-1"
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  {t("regenerateButton") || "Regenerate Questions"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between bg-muted/10">
          <div className="flex flex-col">
            {/* <ul>
              {results.map((result) => (
                <li key={result.timestamp}>{result.transcript}</li>
              ))}
              {interimResult && <li>{interimResult}</li>}
            </ul> */}
            <p className="text-sm text-muted-foreground">
              {t("liveInterview.interviewTip")}
            </p>
          </div>
          <Button variant="destructive" onClick={handleEndInterview}>
            {t("liveInterview.endInterviewButton")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
