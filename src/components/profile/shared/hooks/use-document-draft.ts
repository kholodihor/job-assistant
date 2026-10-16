import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { DocumentConfig } from "@/components/profile/shared/document-config";
import { useRouter } from "@/i18n/routing";
import { DocumentDataMap, DocumentKind } from "@/types/document";

// Single-document editor state: loads the existing document (edit mode) or the
// localStorage draft (create mode), and saves it to the database
export const useDocumentDraft = <K extends DocumentKind>(
  config: DocumentConfig<K>,
  documentId?: string
) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [data, setData] = useState<DocumentDataMap[K]>(config.initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingToDb, setIsSavingToDb] = useState(false);
  const router = useRouter();

  // Load the existing document (edit mode) or the local draft (create mode)
  useEffect(() => {
    if (!documentId) {
      const savedData = localStorage.getItem(config.draftStorageKey);
      if (savedData) {
        try {
          setData(JSON.parse(savedData));
        } catch {
          localStorage.removeItem(config.draftStorageKey);
        }
      }
      setIsInitialized(true);
      return;
    }

    setIsInitialized(false);
    const controller = new AbortController();
    const fetchDocument = async () => {
      try {
        const response = await fetch(`${config.endpoint}/${documentId}`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || `Failed to fetch ${config.label}`);
        }
        setData(await response.json());
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error(`Error fetching ${config.label}:`, error);
        toast.error(config.messages.loadFailed);
      } finally {
        if (!controller.signal.aborted) setIsInitialized(true);
      }
    };
    fetchDocument();
    return () => controller.abort();
  }, [documentId, config]);

  // Update state and persist the draft to localStorage
  const updateData = useCallback(
    (newData: DocumentDataMap[K]) => {
      setData(newData);
      // Only persist a draft for new documents; edits are saved to the DB
      if (!documentId) {
        setIsSaving(true);
        localStorage.setItem(config.draftStorageKey, JSON.stringify(newData));
        setTimeout(() => setIsSaving(false), 500);
      }
    },
    [documentId, config]
  );

  // Save document to database
  const saveToDatabase = useCallback(async () => {
    try {
      setIsSavingToDb(true);

      const missingFields = config.requiredFields.filter(
        (field) => !data[field]
      );
      if (missingFields.length > 0) {
        throw new Error(
          `Please fill in all required fields (${missingFields.join(", ")})`
        );
      }

      const dataToSend = await config.prepareForSave(data);

      const url = documentId
        ? `${config.endpoint}/${documentId}`
        : config.endpoint;
      const method = documentId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: dataToSend }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || config.messages.saveFailed);
      }

      const saved = await response.json();
      // Merge Cloudinary info returned by the API
      setData((prev) => config.mergeSaved(prev, saved));

      toast.success(config.messages.saveSuccess);

      if (!documentId) localStorage.removeItem(config.draftStorageKey);
      router.push(config.route);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : config.messages.saveFailed
      );
    } finally {
      setIsSavingToDb(false);
    }
  }, [data, router, documentId, config]);

  return {
    data,
    updateData,
    saveToDatabase,
    isInitialized,
    isSaving,
    isSavingToDb,
  };
};
