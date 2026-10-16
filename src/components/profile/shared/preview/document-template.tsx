import { ComponentType } from "react";
import { DocumentDataMap, DocumentKind } from "@/types/document";
import {
  renderLetterTemplate,
  renderResumeTemplate,
} from "@/utils/render-template";

/** Document data tagged with its kind, e.g. { kind: "resume"; data: ResumeData } */
export interface PreviewDocument<K extends DocumentKind = DocumentKind> {
  kind: K;
  data: DocumentDataMap[K];
}

const templateRenderers: {
  [K in DocumentKind]: (
    template: string
  ) => ComponentType<{ data: DocumentDataMap[K] }>;
} = {
  resume: renderResumeTemplate,
  letter: renderLetterTemplate,
};

/** Renders `data` with the resume or letter template named `template` */
export const DocumentTemplate = <K extends DocumentKind>({
  kind,
  data,
  template,
}: PreviewDocument<K> & { template: string }) => {
  const Template = templateRenderers[kind](template);
  return <Template data={data} />;
};
