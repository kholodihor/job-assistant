"use client";

import { letterConfig } from "@/components/profile/cover-letter/config";
import { steps } from "@/components/profile/cover-letter/editor/steps";
import { DocumentEditor } from "@/components/profile/shared/editor/document-editor";

export const LetterEditor = () => (
  <DocumentEditor config={letterConfig} steps={steps} />
);
