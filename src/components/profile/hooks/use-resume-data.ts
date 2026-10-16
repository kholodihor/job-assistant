import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { initialData } from "@/components/profile/resume/editor/forms/initialdata";
import { useRouter } from "@/i18n/routing";
import { ResumeData } from "@/types/resume";

const STORAGE_KEY = "resumeData";
const REQUIRED_FIELDS = [
  "name",
  "profession",
  "summary",
  "title",
  "template",
] as const;

interface SavedResume {
  photo?: string;
  publicId?: string;
}

const convertPhotoToBase64 = async (photo: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(photo);
  });
};

const validateRequiredFields = (data: ResumeData): void => {
  const missingFields = REQUIRED_FIELDS.filter((field) => !data[field]);
  if (missingFields.length > 0) {
    throw new Error(
      `Please fill in all required fields (${missingFields.join(", ")})`
    );
  }
};

// Custom hook for managing resume data with localStorage
export const useResumeData = (resumeId?: string) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingToDb, setIsSavingToDb] = useState(false);
  const router = useRouter();

  // Load the existing resume (edit mode) or the local draft (create mode)
  useEffect(() => {
    if (!resumeId) {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        try {
          setResumeData(JSON.parse(savedData));
        } catch {
          if (!resumeId) localStorage.removeItem(STORAGE_KEY);
        }
      }
      setIsInitialized(true);
      return;
    }

    setIsInitialized(false);
    const controller = new AbortController();
    const fetchResume = async () => {
      try {
        const response = await fetch(`/api/resumes/${resumeId}`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to fetch resume");
        }
        const resume = await response.json();
        setResumeData(resume);
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Error fetching resume:", error);
        toast.error("Failed to load resume data");
      } finally {
        if (!controller.signal.aborted) setIsInitialized(true);
      }
    };
    fetchResume();
    return () => controller.abort();
  }, [resumeId]);

  // Save data to localStorage with debounce
  const updateResumeData = useCallback(
    (newData: ResumeData) => {
      setResumeData(newData);
      // Only persist a draft for new documents; edits are saved to the DB
      if (!resumeId) {
        setIsSaving(true);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
        setTimeout(() => setIsSaving(false), 500);
      }
    },
    [resumeId]
  );

  // Update resume data with Cloudinary info
  const updateCloudinaryData = useCallback((savedResume: SavedResume) => {
    if (savedResume.photo && savedResume.publicId) {
      setResumeData((prev) => ({
        ...prev,
        photo: savedResume.photo,
        publicId: savedResume.publicId,
      }));
    }
  }, []);

  // Save resume to database
  const saveToDatabase = useCallback(async () => {
    try {
      setIsSavingToDb(true);
      validateRequiredFields(resumeData);

      const dataToSend = { ...resumeData };

      // Handle photo upload if it's a File
      if (resumeData.photo instanceof File) {
        dataToSend.photo = await convertPhotoToBase64(resumeData.photo);
      }

      const url = resumeId ? `/api/resumes/${resumeId}` : "/api/resumes";
      const method = resumeId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: dataToSend }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to save resume");
      }

      const savedResume = await response.json();
      updateCloudinaryData(savedResume);

      toast.success("Resume saved successfully");

      if (!resumeId) localStorage.removeItem(STORAGE_KEY);
      router.push("/profile/resume");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save resume"
      );
    } finally {
      setIsSavingToDb(false);
    }
  }, [resumeData, router, updateCloudinaryData, resumeId]);

  return {
    resumeData,
    updateResumeData,
    saveToDatabase,
    isInitialized,
    isSaving,
    isSavingToDb,
  };
};
