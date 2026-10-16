import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useCachedLetters } from "@/components/profile/cover-letter/hooks/use-letters";
import { useAlert } from "@/contexts/alert-context";
import { ILetter } from "@/types/letter";

type LetterWithDuplicate =
  | ILetter
  | { id: string; title: string; data: ILetter; isDuplicate: boolean };

export const useLetterLogic = () => {
  const { showAlert } = useAlert();
  const locale = useLocale();
  const t = useTranslations("letter");
  const {
    letters,
    duplicatedLetters,
    isLoading,
    isDeleting,
    handleDuplicate,
    handleDeleteDuplicate,
    handleDeleteLetter,
    handleTitleChange,
  } = useCachedLetters(t);

  const handleDelete = (id: string, isDuplicate = false) => {
    if (isDuplicate) {
      handleDeleteDuplicate(id);
    } else {
      handleDeleteLetter(id);
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

  const handleDuplicateLetter = (letter: ILetter) => {
    handleDuplicate({ ...letter });
  };

  const getLetterData = (letter: LetterWithDuplicate) => {
    if ("data" in letter) {
      return { ...letter.data };
    }
    return { ...letter };
  };

  const allLetters = useMemo(
    () => [
      ...letters,
      ...duplicatedLetters.map((dr) => ({
        id: dr.id,
        title: dr.title,
        data: dr.data,
        isDuplicate: true,
      })),
    ],
    [letters, duplicatedLetters]
  );

  return {
    t,
    locale,
    allLetters,
    isLoading,
    handleTitleChange,
    getLetterData,
    handleDeleteClick,
    handleDuplicateLetter,
  };
};
