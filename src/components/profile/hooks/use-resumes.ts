import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useStorage } from "@/hooks/use-storage";
import { IResume } from "@/types/resume";

interface DuplicatedResume {
  id: string;
  data: IResume;
  title: string;
}

const STORAGE_KEYS = {
  DUPLICATED: "resumes",
} as const;

export const useCachedResumes = (t: (key: string) => string) => {
  const { getStorageData, setStorageData } = useStorage();

  // State
  const [resumes, setResumes] = useState<IResume[]>([]);
  const [duplicatedResumes, setDuplicatedResumes] = useState<
    DuplicatedResume[]
  >(getStorageData(STORAGE_KEYS.DUPLICATED, []));
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  // Data fetching
  const fetchResumes = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/resumes");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setResumes(data);
      }
    } catch (error) {
      console.error("Error loading resumes:", error);
      toast.error(t("errors.loadFailed"), {
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  // Resume operations
  const handleDuplicate = useCallback(
    async (resume: IResume) => {
      const duplicateTitle = `${resume.title} (${t("copy")})`;
      const now = new Date().toISOString();

      // Deep copy arrays and ensure proper structure
      const workExperiences = (resume.workExperiences || []).map((exp) => ({
        id: crypto.randomUUID(),
        company: exp.company || "",
        position: exp.position || "",
        startDate: exp.startDate || "",
        endDate: exp.endDate || "",
        description: exp.description || "",
      }));

      const educations = (resume.educations || []).map((edu) => ({
        institution: edu.institution || "",
        degree: edu.degree || "",
        startDate: edu.startDate || "",
        endDate: edu.endDate || "",
      }));

      const skills = [...(resume.skills || [])];
      const languages = (resume.languages || []).map((lang) => ({
        language: lang.language || "",
        level: lang.level || "",
      }));

      // Base data without ID and timestamps for API
      const apiData: Omit<IResume, "id" | "createdAt" | "updatedAt"> = {
        title: duplicateTitle,
        name: resume.name || "",
        email: resume.email || "",
        template: resume.template || "classic",
        skills,
        languages,
        summary: resume.summary || "",
        phone: resume.phone || "",
        address: resume.address || "",
        profession: resume.profession || "",
        location: resume.location || "",
        github: resume.github || "",
        linkedin: resume.linkedin || "",
        behance: resume.behance || "",
        telegram: resume.telegram || "",
        dribbble: resume.dribbble || "",
        adobePortfolio: resume.adobePortfolio || "",
        photo: resume.photo || "",
        educations,
        workExperiences,
      };

      // Full data with ID and timestamps for local storage
      const localData: IResume = {
        ...apiData,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
      };

      try {
        const response = await fetch("/api/resumes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: apiData }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const newResume = await response.json();

        // Ensure newResume has all the required arrays initialized
        const processedResume: IResume = {
          ...newResume,
          workExperiences: newResume.workExperiences || [],
          educations: newResume.educations || [],
          languages: newResume.languages || [],
          skills: newResume.skills || [],
        };

        // Update local state with the processed resume
        setResumes((prev) => [...prev, processedResume]);

        toast.success(t("messages.duplicateCreated"), {
          duration: 3000,
        });
      } catch (error) {
        console.error("Error creating duplicate in database:", error);

        // Store in local storage with proper structure
        const duplicatedResume: DuplicatedResume = {
          id: localData.id,
          data: localData,
          title: duplicateTitle,
        };

        setDuplicatedResumes((prev) => {
          const newResumes = [...prev, duplicatedResume];
          setStorageData(STORAGE_KEYS.DUPLICATED, newResumes);
          return newResumes;
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
      setDuplicatedResumes((prev) => {
        const newResumes = prev.filter((resume) => resume.id !== id);
        setStorageData(STORAGE_KEYS.DUPLICATED, newResumes);
        return newResumes;
      });
    },
    [setStorageData]
  );

  const handleDeleteResume = useCallback(
    async (id: string) => {
      try {
        setIsDeleting(true);
        setIsDeletingId(id);

        const response = await fetch(`/api/resumes/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        setResumes((prev) => prev.filter((resume) => resume.id !== id));

        // Show success message after state update
        toast.success(t("messages.deleteSuccess"), {
          duration: 3000,
        });
      } catch (error) {
        console.error("Error deleting resume:", error);
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
      // Check if it's a duplicated resume in local storage
      const isDuplicated = duplicatedResumes.some((resume) => resume.id === id);

      if (isDuplicated) {
        // Update in local storage
        setDuplicatedResumes((prev) => {
          const newResumes = prev.map((resume) =>
            resume.id === id
              ? {
                  ...resume,
                  title: newTitle,
                  data: { ...resume.data, title: newTitle },
                }
              : resume
          );
          setStorageData(STORAGE_KEYS.DUPLICATED, newResumes);
          return newResumes;
        });

        toast.success(t("messages.saveTitleSuccess"), {
          duration: 3000,
        });
        return;
      }

      try {
        // Update title using the dedicated endpoint
        const response = await fetch(`/api/resumes/${id}/title`, {
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
        setResumes((prev) =>
          prev.map((resume) =>
            resume.id === id ? { ...resume, title } : resume
          )
        );

        toast.success(t("messages.saveTitleSuccess"), {
          duration: 3000,
        });
      } catch (error) {
        console.error("Error updating resume title:", error);
        toast.error(t("errors.saveTitleFailed"), {
          duration: 3000,
        });
      }
    },
    [t, duplicatedResumes, setStorageData]
  );

  // Initial data fetch
  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  return {
    resumes,
    duplicatedResumes,
    isLoading,
    isDeleting,
    isDeletingId,
    refreshResumes: fetchResumes,
    handleDuplicate,
    handleDeleteDuplicate,
    handleDeleteResume,
    handleTitleChange,
  };
};
