import { Eraser, Mic, MicOff, WebcamIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";

interface WebcamPanelProps {
  webcamEnabled: boolean;
  onWebcamChange: (enabled: boolean) => void;
  isRecording: boolean;
  interimResult?: string;
  onStartRecording: () => void;
  onStopRecording: () => void;
  canClearAnswer: boolean;
  onClearAnswer: () => void;
}

export const WebcamPanel = ({
  webcamEnabled,
  onWebcamChange,
  isRecording,
  interimResult,
  onStartRecording,
  onStopRecording,
  canClearAnswer,
  onClearAnswer,
}: WebcamPanelProps) => {
  const t = useTranslations("Interviewer");
  const micDisabled = !webcamEnabled && !isRecording;

  return (
    <>
      <div className="flex aspect-video items-center justify-center overflow-hidden rounded-lg border bg-muted/20">
        {webcamEnabled ? (
          <Webcam
            audio={isRecording}
            onUserMedia={() => onWebcamChange(true)}
            onUserMediaError={() => onWebcamChange(false)}
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
          onClick={() => onWebcamChange(!webcamEnabled)}
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
          onClick={isRecording ? onStopRecording : onStartRecording}
          disabled={micDisabled}
          title={micDisabled ? t("liveInterview.micDisabled") : undefined}
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
          onClick={onClearAnswer}
          className="flex-1"
          disabled={!canClearAnswer}
        >
          <Eraser className="mr-2 h-4 w-4" />
          {t("liveInterview.clearAnswer")}
        </Button>
      </div>
    </>
  );
};
