import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { CardHeader, CardTitle } from "@/components/ui/card";

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

interface LiveInterviewHeaderProps {
  id: string;
  jobPosition: string;
  /** The timer only ticks while this is true (camera on). */
  timerRunning: boolean;
}

export const LiveInterviewHeader = ({
  id,
  jobPosition,
  timerRunning,
}: LiveInterviewHeaderProps) => {
  const t = useTranslations("Interviewer");
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!timerRunning) return;
    const timer = setInterval(() => setElapsedTime((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, [timerRunning]);

  return (
    <CardHeader className="bg-blue-50">
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="text-2xl font-bold">
            {t("liveInterview.title")}
          </CardTitle>
          <p className="mt-1 text-muted-foreground">{jobPosition}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {formatTime(elapsedTime)}
          </Badge>
          <Badge variant="secondary">
            {t("liveInterview.interviewNumber", { id })}
          </Badge>
        </div>
      </div>
    </CardHeader>
  );
};
