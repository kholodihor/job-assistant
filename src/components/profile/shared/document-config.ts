import {
  DocumentDataMap,
  DocumentKind,
  EditorFormProps,
} from "@/types/document";

/** Fields the API may return after a save (Cloudinary upload info). */
export interface SavedDocumentInfo {
  photo?: string;
  publicId?: string;
}

/** Everything that differs between the resume and cover-letter features. */
export interface DocumentConfig<K extends DocumentKind> {
  kind: K;
  /** Lowercase noun used in console logs, e.g. "resume" */
  label: string;
  /** API collection endpoint, e.g. "/api/resumes" */
  endpoint: string;
  /** App route of the list page, e.g. "/profile/resume" */
  route: string;
  /** next-intl namespace of the list page */
  namespace: string;
  defaultTemplate: string;
  /** localStorage key for duplicates that could not be saved to the API */
  duplicatesStorageKey: string;
  /** localStorage key for the draft of a new document */
  draftStorageKey: string;
  initialData: DocumentDataMap[K];
  requiredFields: readonly (keyof DocumentDataMap[K] & string)[];
  /** Fill in optional fields a document needs to render/duplicate safely */
  normalize: <D extends DocumentDataMap[K]>(doc: D) => D;
  /** Build the payload for a duplicate of `doc` titled `title` */
  buildCopy: (doc: DocumentDataMap[K], title: string) => DocumentDataMap[K];
  /** Transform the draft into the payload sent on save */
  prepareForSave: (
    data: DocumentDataMap[K]
  ) => DocumentDataMap[K] | Promise<DocumentDataMap[K]>;
  /** Merge info returned by the API after a save into the local draft */
  mergeSaved: (
    prev: DocumentDataMap[K],
    saved: SavedDocumentInfo
  ) => DocumentDataMap[K];
  messages: {
    loadFailed: string;
    saveFailed: string;
    saveSuccess: string;
  };
}

/** One editor step: a breadcrumb title (translation key) and its form */
export interface EditorStep<T> {
  titleKey: string;
  component: React.ComponentType<EditorFormProps<T>>;
  key: string;
}
