"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useRouter } from "@/i18n/routing";
import { InterviewChat } from "./interview-chat";
import { InterviewDetails } from "./interview-details";
import { LiveInterviewHeader } from "./live-interview-header";
import { QuestionNavigation } from "./question-navigation";
import { StatusScreen } from "./status-screen";
import { useAnswerRecorder } from "./use-answer-recorder";
import { useInterviewSession } from "./use-interview-session";
import { WebcamPanel } from "./webcam-panel";

export const LiveInterviewClient = ({ id }: { id: string }) => {
  const t = useTranslations("Interviewer");
  const locale = useLocale();
  const router = useRouter();
  const [webcamEnabled, setWebcamEnabled] = useState(false);

  const session = useInterviewSession(id);
  const recorder = useAnswerRecorder({
    locale,
    enabled: webcamEnabled,
    onAnswer: session.addUserAnswer,
  });

  const backToList = () => router.push("/profile/interview");

  if (session.isLoading) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center py-12">
        <Loader2 className="mb-4 h-8 w-8 animate-spin" />
        <p>{t("loadingMessage")}</p>
      </div>
    );
  }

  if (session.error || !session.interview) {
    return (
      <StatusScreen
        variant={session.error ? "error" : "warning"}
        title={t(
          session.error
            ? "liveInterview.errorTitle"
            : "liveInterview.notFoundTitle"
        )}
        description={session.error ?? t("liveInterview.notFoundDescription")}
        actionLabel={t("liveInterview.returnButton")}
        onAction={backToList}
      />
    );
  }

  const { interview } = session;

  return (
    <div className="container mx-auto px-[24px]">
      <Card>
        <LiveInterviewHeader
          id={id}
          jobPosition={interview.jobPosition}
          timerRunning={webcamEnabled}
        />
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col space-y-4">
              <WebcamPanel
                webcamEnabled={webcamEnabled}
                onWebcamChange={setWebcamEnabled}
                isRecording={recorder.isRecording}
                interimResult={recorder.interimResult}
                onStartRecording={recorder.startRecording}
                onStopRecording={recorder.stopRecording}
                canClearAnswer={session.hasUserAnswer}
                onClearAnswer={session.clearLastAnswer}
              />
              <InterviewDetails
                jobPosition={interview.jobPosition}
                jobExperience={interview.jobExperience}
                techStack={interview.techStack}
              />
            </div>

            <div className="flex h-full flex-col">
              <InterviewChat
                messages={session.messages}
                isGenerating={session.isGenerating}
              />
              <QuestionNavigation
                currentIndex={session.currentQuestionIndex}
                total={session.questions?.length ?? 0}
                canCheckAnswer={session.canCheckAnswer}
                isGeneratingFeedback={session.isGeneratingFeedback}
                onCheckAnswer={session.checkCurrentAnswer}
                onPrevious={session.goToPreviousQuestion}
                onNext={session.goToNextQuestion}
                isGenerating={session.isGenerating}
                onRegenerate={session.regenerateQuestions}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between bg-muted/10">
          <p className="text-sm text-muted-foreground">
            {t("liveInterview.interviewTip")}
          </p>
          <Button variant="destructive" onClick={backToList}>
            {t("liveInterview.endInterviewButton")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
