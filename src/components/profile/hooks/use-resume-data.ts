import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { initialData } from "@/components/profile/resume/editor/forms/initialdata";
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
  const [isClient, setIsClient] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingToDb, setIsSavingToDb] = useState(false);
  const router = useRouter();

  // Initialize client-side data
  useEffect(() => {
    setIsClient(true);
    if (resumeId) {
      // If we have a resume ID, fetch that resume's data
      const fetchResume = async () => {
        try {
          const response = await fetch(`/api/resumes/${resumeId}`);
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to fetch resume");
          }
          const resume = await response.json();
          // The resume data is directly in the response, not in a data property

          console.log("str 62 resume-data-> resume", resume);
          setResumeData(resume);
        } catch (error) {
          console.error("Error fetching resume:", error);
          toast.error("Failed to load resume data");
        }
      };
      fetchResume();
    } else {
      // Otherwise load from localStorage
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        setResumeData(JSON.parse(savedData));
      }
    }
  }, [resumeId]);

  // Save data to localStorage with debounce
  const updateResumeData = useCallback(
    (newData: ResumeData) => {
      setResumeData(newData);
      if (isClient) {
        setIsSaving(true);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
        setTimeout(() => setIsSaving(false), 500);
      }
    },
    [isClient]
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

      localStorage.removeItem(STORAGE_KEY);
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
    isInitialized: isClient,
    isSaving,
    isSavingToDb,
  };
};
