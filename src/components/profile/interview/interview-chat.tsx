import { Loader2, MessageSquare } from "lucide-react";
import { useTranslations } from "next-intl";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "./use-interview-session";

const bubbleStyles: Record<ChatMessage["sender"], string> = {
  user: "self-end bg-blue-100",
  feedback: "self-start border border-green-200 bg-green-50",
  interviewer: "self-start bg-blue-50",
};

interface InterviewChatProps {
  messages: ChatMessage[];
  isGenerating: boolean;
}

export const InterviewChat = ({
  messages,
  isGenerating,
}: InterviewChatProps) => {
  const t = useTranslations("Interviewer");
  const senderLabels: Record<ChatMessage["sender"], string> = {
    user: t("liveInterview.senderYou"),
    feedback: t("liveInterview.senderFeedback"),
    interviewer: t("liveInterview.senderInterviewer"),
  };

  return (
    <div className="max-h-[400px] flex-1 overflow-y-auto rounded-lg border bg-muted/10 p-4">
      <h3 className="mb-4 flex items-center font-medium">
        <MessageSquare className="mr-2 h-5 w-5" />
        {t("liveInterview.interviewChat")}
      </h3>
      <Separator className="my-2" />

      <div className="space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className="flex flex-col">
            <div
              className={cn(
                "text-black inline-block max-w-[80%] rounded-lg p-3",
                bubbleStyles[msg.sender]
              )}
            >
              <p className="text-sm font-medium">{senderLabels[msg.sender]}</p>
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      {isGenerating && (
        <div className="mt-4 flex items-center justify-center rounded-lg border border-blue-100 bg-blue-50 p-3">
          <Loader2 className="mr-2 h-4 w-4 animate-spin text-blue-600" />
          <p className="text-sm text-blue-700">
            {t("generatingQuestionsMessage")}
          </p>
        </div>
      )}
    </div>
  );
};
