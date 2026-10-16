"use client";

import { useEffect, useRef } from "react";
import useSpeechToText from "react-hook-speech-to-text";

interface UseAnswerRecorderOptions {
  locale: string;
  /** Recording is stopped as soon as this turns false (camera switched off). */
  enabled: boolean;
  /** Called with the joined transcript once a recording stops. */
  onAnswer: (answer: string) => void;
}

export function useAnswerRecorder({
  locale,
  enabled,
  onAnswer,
}: UseAnswerRecorderOptions) {
  const {
    interimResult,
    isRecording,
    results,
    setResults,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
    speechRecognitionProperties: {
      lang: locale === "ua" ? "uk-UA" : "en-US",
    },
  });

  const onAnswerRef = useRef(onAnswer);
  onAnswerRef.current = onAnswer;

  // When recording stops, join every segment of this recording into one answer
  useEffect(() => {
    if (isRecording || results.length === 0) return;
    const answer = results
      .map((result) =>
        typeof result === "string" ? result : result.transcript
      )
      .join(" ")
      .trim();
    if (answer) onAnswerRef.current(answer);
    setResults([]);
  }, [isRecording, results, setResults]);

  const isRecordingRef = useRef(isRecording);
  isRecordingRef.current = isRecording;
  const stopSpeechToTextRef = useRef(stopSpeechToText);
  stopSpeechToTextRef.current = stopSpeechToText;

  // Stop recording when the camera is switched off
  useEffect(() => {
    if (!enabled && isRecordingRef.current) stopSpeechToTextRef.current();
  }, [enabled]);

  // Stop the recognizer on unmount
  useEffect(
    () => () => {
      if (isRecordingRef.current) stopSpeechToTextRef.current();
    },
    []
  );

  return {
    interimResult,
    isRecording,
    startRecording: startSpeechToText,
    stopRecording: stopSpeechToText,
  };
}
