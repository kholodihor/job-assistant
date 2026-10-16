import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
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
  } = useCachedResumes(t);

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
    handleDuplicate({
      ...resume,
      workExperiences: resume.workExperiences || [],
      educations: resume.educations || [],
      languages: resume.languages || [],
      skills: resume.skills || [],
    });
  };

  const getResumeData = (resume: ResumeWithDuplicate) => {
    const data = "data" in resume ? resume.data : resume;
    return {
      ...data,
      workExperiences: data.workExperiences || [],
      educations: data.educations || [],
      languages: data.languages || [],
      skills: data.skills || [],
    };
  };

  const allResumes = useMemo(
    () => [
      ...resumes,
      ...duplicatedResumes.map((dr) => ({
        id: dr.id,
        title: dr.title,
        data: dr.data,
        isDuplicate: true,
      })),
    ],
    [resumes, duplicatedResumes]
  );

  return {
    t,
    locale,
    allResumes,
    isLoading,
    handleTitleChange,
    getResumeData,
    handleDeleteClick,
    handleDuplicateResume,
  };
};
