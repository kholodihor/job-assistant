import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useStorage } from "@/hooks/use-storage";
import { ILetter } from "@/types/letter";

interface DuplicatedLetter {
  id: string;
  data: ILetter;
  title: string;
}

const STORAGE_LETTER_KEYS = {
  DUPLICATED: "letters",
} as const;

export const useCachedLetters = (t: (key: string) => string) => {
  const { getStorageData, setStorageData } = useStorage();

  // State
  const [letters, setLetters] = useState<ILetter[]>([]);
  const [duplicatedLetters, setDuplicatedLetters] = useState<
    DuplicatedLetter[]
  >(getStorageData(STORAGE_LETTER_KEYS.DUPLICATED, []));
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  // Data fetching
  const fetchLetters = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/letters");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setLetters(data);
      }
    } catch (error) {
      console.error("Error loading letters:", error);
      toast.error(t("errors.loadFailed"), {
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  // Letter operations
  const handleDuplicate = useCallback(
    async (letter: ILetter) => {
      const duplicateTitle = `${letter.title} (${t("copy")})`;
      const now = new Date().toISOString();

      // Base data without ID and timestamps for API
      const apiData: Omit<ILetter, "id" | "createdAt" | "updatedAt"> = {
        title: duplicateTitle,
        name: letter.name || "",
        email: letter.email || "",
        template: letter.template || "short",
        text: letter.text || "",
        phone: letter.phone || "",
        profession: letter.profession || "",
        position: letter.position || "",
        location: letter.location || "",
        company: letter.company || "",
        nameRecipient: letter.nameRecipient || "",
        positionRecipient: letter.positionRecipient || "",
      };

      // Full data with ID and timestamps for local storage
      const localData: ILetter = {
        ...apiData,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
      };

      try {
        const response = await fetch("/api/letters", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: apiData }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const newLetter = await response.json();

        // Update local state
        setLetters((prev) => [...prev, newLetter]);

        toast.success(t("messages.duplicateCreated"), {
          duration: 3000,
        });
      } catch (error) {
        console.error("Error creating duplicate in database:", error);

        // Store in local storage with proper structure
        const duplicatedLetter: DuplicatedLetter = {
          id: localData.id,
          data: localData,
          title: duplicateTitle,
        };

        setDuplicatedLetters((prev) => {
          const newLetters = [...prev, duplicatedLetter];
          setStorageData(STORAGE_LETTER_KEYS.DUPLICATED, newLetters);
          return newLetters;
        });

        toast.error(t("errors.saveFailed"), {
          duration: 3000,
        });
      }
    },
    [t, setStorageData]
  );

  const handleDeleteDuplicate = useCallback(
    (id: string) => {
      setDuplicatedLetters((prev) => {
        const newLetters = prev.filter((letter) => letter.id !== id);
        setStorageData(STORAGE_LETTER_KEYS.DUPLICATED, newLetters);
        return newLetters;
      });
    },
    [setStorageData]
  );

  const handleDeleteLetter = useCallback(
    async (id: string) => {
      try {
        setIsDeleting(true);
        setIsDeletingId(id);

        const response = await fetch(`/api/letters/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        setLetters((prev) => prev.filter((letter) => letter.id !== id));

        // Show success message after state update
        toast.success(t("messages.deleteSuccess"), {
          duration: 3000,
        });
      } catch (error) {
        console.error("Error deleting the letter:", error);
        toast.error(t("errors.deleteFailed"), {
          duration: 3000,
        });
      } finally {
        setIsDeleting(false);
        setIsDeletingId(null);
      }
    },
    [t]
  );

  const handleTitleChange = useCallback(
    async (id: string, newTitle: string) => {
      // Check if it's a duplicated the letter in local storage
      const isDuplicated = duplicatedLetters.some((letter) => letter.id === id);

      if (isDuplicated) {
        // Update in local storage
        setDuplicatedLetters((prev) => {
          const newLetters = prev.map((letter) =>
            letter.id === id
              ? {
                  ...letter,
                  title: newTitle,
                  data: { ...letter.data, title: newTitle },
                }
              : letter
          );
          setStorageData(STORAGE_LETTER_KEYS.DUPLICATED, newLetters);
          return newLetters;
        });

        toast.success(t("messages.saveTitleSuccess"), {
          duration: 3000,
        });
        return;
      }

      try {
        // Update title using the dedicated endpoint
        const response = await fetch(`/api/letters/${id}/title`, {
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
        setLetters((prev) =>
          prev.map((letter) =>
            letter.id === id ? { ...letter, title } : letter
          )
        );

        toast.success(t("messages.saveTitleSuccess"), {
          duration: 3000,
        });
      } catch (error) {
        console.error("Error updating the title of the letter:", error);
        toast.error(t("errors.saveTitleFailed"), {
          duration: 3000,
        });
      }
    },
    [t, duplicatedLetters, setStorageData]
  );

  // Initial data fetch
  useEffect(() => {
    fetchLetters();
  }, [fetchLetters]);

  return {
    letters,
    duplicatedLetters,
    isLoading,
    isDeleting,
    isDeletingId,
    refreshLetters: fetchLetters,
    handleDuplicate,
    handleDeleteDuplicate,
    handleDeleteLetter,
    handleTitleChange,
  };
};
