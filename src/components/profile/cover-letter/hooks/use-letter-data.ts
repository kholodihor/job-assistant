import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { initialData } from "@/components/profile/cover-letter/editor/forms/initialdata";
import { useRouter } from "@/i18n/routing";
import { LetterData } from "@/types/letter";

const STORAGE_LETTER_KEY = "letterData";
const REQUIRED_FIELDS = [
  "name",
  "profession",
  "position",
  "company",
  "text",
  "title",
  "template",
] as const;

interface SavedLetter {
  publicId?: string;
}

const validateRequiredFields = (data: LetterData): void => {
  const missingFields = REQUIRED_FIELDS.filter((field) => !data[field]);
  if (missingFields.length > 0) {
    throw new Error(
      `Please fill in all required fields (${missingFields.join(", ")})`
    );
  }
};

// Custom hook for managing letter data with localStorage
export const useLetterData = (letterId?: string) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [letterData, setLetterData] = useState<LetterData>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingToDb, setIsSavingToDb] = useState(false);
  const router = useRouter();

  // Load the existing letter (edit mode) or the local draft (create mode)
  useEffect(() => {
    if (!letterId) {
      const savedData = localStorage.getItem(STORAGE_LETTER_KEY);
      if (savedData) {
        try {
          setLetterData(JSON.parse(savedData));
        } catch {
          if (!letterId) localStorage.removeItem(STORAGE_LETTER_KEY);
        }
      }
      setIsInitialized(true);
      return;
    }

    setIsInitialized(false);
    const controller = new AbortController();
    const fetchLetter = async () => {
      try {
        const response = await fetch(`/api/letters/${letterId}`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to fetch letter");
        }
        const letter = await response.json();
        setLetterData(letter);
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Error fetching letter:", error);
        toast.error("Failed to load letter data");
      } finally {
        if (!controller.signal.aborted) setIsInitialized(true);
      }
    };
    fetchLetter();
    return () => controller.abort();
  }, [letterId]);

  // Save data to localStorage with debounce
  const updateLetterData = useCallback(
    (newData: LetterData) => {
      setLetterData(newData);
      // Only persist a draft for new documents; edits are saved to the DB
      if (!letterId) {
        setIsSaving(true);
        localStorage.setItem(STORAGE_LETTER_KEY, JSON.stringify(newData));
        setTimeout(() => setIsSaving(false), 500);
      }
    },
    [letterId]
  );

  // Update letter data with Cloudinary info
  const updateCloudinaryData = useCallback((SavedLetter: SavedLetter) => {
    if (SavedLetter.publicId) {
      setLetterData((prev) => ({
        ...prev,
        publicId: SavedLetter.publicId,
      }));
    }
  }, []);

  // Save letter to database
  const saveToDatabase = useCallback(async () => {
    try {
      setIsSavingToDb(true);
      validateRequiredFields(letterData);

      // Ensure all required fields are included
      const dataToSend = {
        ...letterData,
        name: letterData.name || "",
        profession: letterData.profession || "",
        position: letterData.position || "",
        company: letterData.company || "",
        text: letterData.text || "",
        title: letterData.title || "",
        template: letterData.template || "short",
        nameRecipient: letterData.nameRecipient || "",
        positionRecipient: letterData.positionRecipient || "",
      };

      const url = letterId ? `/api/letters/${letterId}` : "/api/letters";
      const method = letterId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: dataToSend }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to save the letter");
      }

      const savedLetter = await response.json();
      updateCloudinaryData(savedLetter);

      toast.success("Letter saved successfully");

      if (!letterId) localStorage.removeItem(STORAGE_LETTER_KEY);
      router.push("/profile/cover-letter");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save the letter"
      );
    } finally {
      setIsSavingToDb(false);
    }
  }, [letterData, router, updateCloudinaryData, letterId]);

  return {
    letterData,
    updateLetterData,
    saveToDatabase,
    isInitialized,
    isSaving,
    isSavingToDb,
  };
};
