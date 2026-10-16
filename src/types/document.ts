import { LetterData } from "./letter";
import { ResumeData } from "./resume";

export interface DocumentDataMap {
  resume: ResumeData;
  letter: LetterData;
}

export type DocumentKind = keyof DocumentDataMap;

/** A document as returned by the API (data + id and timestamps). */
export type StoredDocument<K extends DocumentKind> = DocumentDataMap[K] & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export interface EditorFormProps<T> {
  data: T;
  setData: (data: T) => void;
}
