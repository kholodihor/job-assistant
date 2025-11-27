import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { useCachedLetters } from "@/components/profile/cover-letter/hooks/use-letters";
import { PrintPreview } from "@/components/profile/cover-letter/print-preview";
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
    refreshLetters,
  } = useCachedLetters(t);

  const letterRef = useRef<HTMLDivElement>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [currentLetter, setCurrentLetter] = useState<ILetter | null>(null);

  const reactToPrintFn = (letter: ILetter) => {
    setCurrentLetter(letter);
    setIsPrinting(true);
  };

  useEffect(() => {
    refreshLetters();
  }, [refreshLetters]);

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
    toast.success(t("messages.duplicateCreated"), {
      duration: 3000,
    });
  };

  const getLetterData = (letter: LetterWithDuplicate) => {
    if ("data" in letter) {
      return { ...letter.data };
    }
    return { ...letter };
  };

  const allLetters = [
    ...letters,
    ...duplicatedLetters.map((dr) => ({
      id: dr.id,
      title: dr.title,
      data: dr.data,
      isDuplicate: true,
    })),
  ];

  return {
    t,
    letterRef,
    locale,
    allLetters,
    isLoading,
    isDeleting,
    reactToPrintFn,
    showAlert,
    handleDuplicate,
    handleTitleChange,
    handleDelete,
    refreshLetters,
    getLetterData,
    handleDeleteClick,
    handleDuplicateLetter,
    printComponent:
      isPrinting && currentLetter ? (
        <PrintPreview
          letter={currentLetter}
          onPrintComplete={() => {
            setIsPrinting(false);
            setCurrentLetter(null);
          }}
        />
      ) : null,
  };
};
