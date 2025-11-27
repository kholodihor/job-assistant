import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { PrintPreview } from "@/components/profile/shared/preview/print-preview";
import { useAlert } from "@/contexts/alert-context";
import { IResume } from "@/types/resume";
import { useCachedResumes } from "./use-resumes";

type ResumeWithDuplicate =
  | IResume
  | { id: string; title: string; data: IResume; isDuplicate: boolean };

export const useResumeLogic = () => {
  const { showAlert } = useAlert();
  const locale = useLocale();
  const t = useTranslations("resume");
  const {
    resumes,
    duplicatedResumes,
    isLoading,
    isDeleting,
    handleDuplicate,
    handleDeleteDuplicate,
    handleDeleteResume,
    handleTitleChange,
    refreshResumes,
  } = useCachedResumes(t);

  const resumeRef = useRef<HTMLDivElement>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [currentResume, setCurrentResume] = useState<IResume | null>(null);

  const reactToPrintFn = (resume: IResume) => {
    setCurrentResume(resume);
    setIsPrinting(true);
  };

  useEffect(() => {
    refreshResumes();
  }, [refreshResumes]);

  const handleDelete = (id: string, isDuplicate = false) => {
    if (isDuplicate) {
      handleDeleteDuplicate(id);
    } else {
      handleDeleteResume(id);
    }
  };

  const handleDeleteClick = (id: string, isDuplicate = false) => {
    showAlert({
      title: t("delete.title"),
      description: t("delete.description"),
      cancelText: t("actions.cancel"),
      confirmText: t("delete.confirm"),
      loadingText: t("delete.deleting"),
      isLoading: isDeleting,
      variant: "destructive",
      onConfirm: () => handleDelete(id, isDuplicate),
    });
  };

  const handleDuplicateResume = (resume: IResume) => {
    const processedResume: IResume = {
      ...resume,
      workExperiences: resume.workExperiences || [],
      educations: resume.educations || [],
      languages: resume.languages || [],
      skills: resume.skills || [],
    };

    handleDuplicate(processedResume);
    toast.success(t("messages.duplicateCreated"), {
      duration: 3000,
    });
  };

  const getResumeData = (resume: ResumeWithDuplicate) => {
    if ("data" in resume) {
      return {
        ...resume.data,
        workExperiences: resume.data.workExperiences || [],
        educations: resume.data.educations || [],
        languages: resume.data.languages || [],
        skills: resume.data.skills || [],
      };
    }
    return {
      ...resume,
      workExperiences: resume.workExperiences || [],
      educations: resume.educations || [],
      languages: resume.languages || [],
      skills: resume.skills || [],
    };
  };

  const allResumes = [
    ...resumes,
    ...duplicatedResumes.map((dr) => ({
      id: dr.id,
      title: dr.title,
      data: dr.data,
      isDuplicate: true,
    })),
  ];

  return {
    t,
    resumeRef,
    locale,
    allResumes,
    isLoading,
    isDeleting,
    reactToPrintFn,
    showAlert,
    handleDuplicate,
    handleTitleChange,
    handleDelete,
    refreshResumes,
    getResumeData,
    handleDeleteClick,
    handleDuplicateResume,
    printComponent:
      isPrinting && currentResume ? (
        <PrintPreview
          resume={currentResume}
          onPrintComplete={() => {
            setIsPrinting(false);
            setCurrentResume(null);
          }}
        />
      ) : null,
  };
};
