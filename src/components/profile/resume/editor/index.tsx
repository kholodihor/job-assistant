"use client";

import { resumeConfig } from "@/components/profile/resume/config";
import { steps } from "@/components/profile/resume/editor/steps";
import { DocumentEditor } from "@/components/profile/shared/editor/document-editor";

export const ResumeEditor = () => (
  <DocumentEditor config={resumeConfig} steps={steps} />
);
