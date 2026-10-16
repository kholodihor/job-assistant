import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { DocumentConfig } from "@/components/profile/shared/document-config";
import { useAlert } from "@/contexts/alert-context";
import { getStorageData, setStorageData } from "@/hooks/use-storage";
import { DocumentKind, StoredDocument } from "@/types/document";

/** A duplicate kept in localStorage because it could not be saved to the API */
interface DuplicatedDocument<K extends DocumentKind> {
  id: string;
  data: StoredDocument<K>;
  title: string;
}

export type ListedDocument<K extends DocumentKind> =
  | StoredDocument<K>
  | {
      id: string;
      title: string;
      data: StoredDocument<K>;
      isDuplicate: boolean;
    };

/** Unwraps a listed document (API document or local duplicate) */
export const getStoredDocument = <K extends DocumentKind>(
  doc: ListedDocument<K>
): StoredDocument<K> => ("data" in doc ? doc.data : doc);

// List page logic: fetch the collection, duplicate, delete and rename documents
export const useDocumentCollection = <K extends DocumentKind>(
  config: DocumentConfig<K>
) => {
  const { showAlert } = useAlert();
  const locale = useLocale();
  const t = useTranslations(config.namespace);

  // State
  const [documents, setDocuments] = useState<StoredDocument<K>[]>([]);
  const [duplicatedDocuments, setDuplicatedDocuments] = useState<
    DuplicatedDocument<K>[]
  >(() => getStorageData(config.duplicatesStorageKey, []));
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  // Data fetching
  const fetchDocuments = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(config.endpoint);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setDocuments(data);
      }
    } catch (error) {
      console.error(`Error loading ${config.label}s:`, error);
      toast.error(t("errors.loadFailed"), {
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [t, config]);

  // Document operations
  const handleDuplicate = useCallback(
    async (doc: StoredDocument<K>) => {
      const duplicateTitle = `${doc.title} (${t("copy")})`;
      const now = new Date().toISOString();

      // Base data without ID and timestamps for API
      const apiData = config.buildCopy(config.normalize(doc), duplicateTitle);

      // Full data with ID and timestamps for local storage
      const localData: StoredDocument<K> = {
        ...apiData,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
      };

      try {
        const response = await fetch(config.endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: apiData }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const newDocument: StoredDocument<K> = await response.json();

        // Update local state with the normalized document
        setDocuments((prev) => [...prev, config.normalize(newDocument)]);

        toast.success(t("messages.duplicateCreated"), {
          duration: 3000,
        });
      } catch (error) {
        console.error("Error creating duplicate in database:", error);

        // Store in local storage with proper structure
        const duplicatedDocument: DuplicatedDocument<K> = {
          id: localData.id,
          data: localData,
          title: duplicateTitle,
        };

        setDuplicatedDocuments((prev) => {
          const newDocuments = [...prev, duplicatedDocument];
          setStorageData(config.duplicatesStorageKey, newDocuments);
          return newDocuments;
        });

        toast.error(t("errors.saveFailed"), {
          duration: 3000,
        });
      }
    },
    [t, config]
  );

  const handleDeleteDuplicate = useCallback(
    (id: string) => {
      setDuplicatedDocuments((prev) => {
        const newDocuments = prev.filter((doc) => doc.id !== id);
        setStorageData(config.duplicatesStorageKey, newDocuments);
        return newDocuments;
      });
    },
    [config]
  );

  const handleDeleteDocument = useCallback(
    async (id: string) => {
      try {
        setIsDeleting(true);

        const response = await fetch(`${config.endpoint}/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        setDocuments((prev) => prev.filter((doc) => doc.id !== id));

        // Show success message after state update
        toast.success(t("messages.deleteSuccess"), {
          duration: 3000,
        });
      } catch (error) {
        console.error(`Error deleting ${config.label}:`, error);
        toast.error(t("errors.deleteFailed"), {
          duration: 3000,
        });
      } finally {
        setIsDeleting(false);
      }
    },
    [t, config]
  );

  const handleTitleChange = useCallback(
    async (id: string, newTitle: string) => {
      // Check if it's a duplicated document in local storage
      const isDuplicated = duplicatedDocuments.some((doc) => doc.id === id);

      if (isDuplicated) {
        // Update in local storage
        setDuplicatedDocuments((prev) => {
          const newDocuments = prev.map((doc) =>
            doc.id === id
              ? {
                  ...doc,
                  title: newTitle,
                  data: { ...doc.data, title: newTitle },
                }
              : doc
          );
          setStorageData(config.duplicatesStorageKey, newDocuments);
          return newDocuments;
        });

        toast.success(t("messages.saveTitleSuccess"), {
          duration: 3000,
        });
        return;
      }

      try {
        // Update title using the dedicated endpoint
        const response = await fetch(`${config.endpoint}/${id}/title`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: newTitle }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const { title } = await response.json();
        setDocuments((prev) =>
          prev.map((doc) => (doc.id === id ? { ...doc, title } : doc))
        );

        toast.success(t("messages.saveTitleSuccess"), {
          duration: 3000,
        });
      } catch (error) {
        console.error(`Error updating ${config.label} title:`, error);
        toast.error(t("errors.saveTitleFailed"), {
          duration: 3000,
        });
      }
    },
    [t, config, duplicatedDocuments]
  );

  // Initial data fetch
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleDeleteClick = (id: string, isDuplicate = false) => {
    showAlert({
      title: t("delete.title"),
      description: t("delete.description"),
      cancelText: t("actions.cancel"),
      confirmText: t("delete.confirm"),
      loadingText: t("delete.deleting"),
      isLoading: isDeleting,
      variant: "destructive",
      onConfirm: () =>
        isDuplicate ? handleDeleteDuplicate(id) : handleDeleteDocument(id),
    });
  };

  /** Unwrapped, normalized data of a listed document (for rendering) */
  const getDocumentData = (doc: ListedDocument<K>) =>
    config.normalize({ ...getStoredDocument(doc) });

  const allDocuments: ListedDocument<K>[] = useMemo(
    () => [
      ...documents,
      ...duplicatedDocuments.map((dd) => ({
        id: dd.id,
        title: dd.title,
        data: dd.data,
        isDuplicate: true,
      })),
    ],
    [documents, duplicatedDocuments]
  );

  return {
    t,
    locale,
    allDocuments,
    isLoading,
    handleTitleChange,
    getDocumentData,
    handleDeleteClick,
    handleDuplicate,
  };
};
