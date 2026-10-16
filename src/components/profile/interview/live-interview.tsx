"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// react-hook-speech-to-text touches `window` at module scope, so the
// implementation must only ever load in the browser.
const LiveInterviewClient = dynamic(
  () => import("./live-interview-client").then((m) => m.LiveInterviewClient),
  {
    ssr: false,
    loading: () => (
      <div className="container mx-auto flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    ),
  }
);

export const LiveInterview = ({ id }: { id: string }) => (
  <LiveInterviewClient id={id} />
);
