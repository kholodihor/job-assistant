import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/shared/icon";

interface DocumentInfoProps {
  title: string;
  lastUpdated: string;
  onDuplicate: () => void;
  onTitleChange: (newTitle: string) => void;
  onDeleteClick: () => void;
  reactToPrintFn: () => void;
  onEditClick?: () => void;
  className?: string;
}

export const DocumentInfo = ({
  title,
  lastUpdated,
  onDuplicate,
  onTitleChange,
  onDeleteClick,
  onEditClick,
  reactToPrintFn,
  className = "",
}: DocumentInfoProps) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [localTitle, setLocalTitle] = useState(title);
  const popupRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations();

  // Update local title when prop changes
  useEffect(() => {
    setLocalTitle(title);
  }, [title]);

  const handleTitleUpdate = (newTitle: string) => {
    if (newTitle.trim() !== title) {
      onTitleChange(newTitle.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      inputRef.current?.blur();
    }
  };

  const handleBlur = () => {
    handleTitleUpdate(localTitle);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsPopupOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDuplicateClick = () => {
    onDuplicate();
    setIsPopupOpen(false);
  };

  const handleDeleteTrigger = () => {
    onDeleteClick();
    setIsPopupOpen(false);
  };

  return (
    <div className="flex w-full justify-between gap-4">
      <div className="min-w-0 flex-1 pl-2">
        <div className="flex flex-col gap-[4px]">
          <div className="relative w-full max-w-[300px]">
            <input
              ref={inputRef}
              type="text"
              value={localTitle}
              onChange={(e) => setLocalTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              className="w-full truncate rounded py-1 text-h5-semibold text-blue-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-200"
            />
          </div>
          <p className="text-small text-blue-700">
            {t("lastUpdated")}{" "}
            <span className="text-small text-blue-700">{lastUpdated}</span>
          </p>
        </div>
      </div>

      <div className="relative flex items-start justify-end pr-[10px] pt-[10px]">
        <button
          type="button"
          ref={buttonRef}
          className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full hover:bg-gray-100 focus:outline-none"
          onClick={() => setIsPopupOpen(!isPopupOpen)}
        >
          <Icon name="ellipsis" size="w-[15px] h-[4px]" />
        </button>

        {isPopupOpen && (
          <div
            ref={popupRef}
            className={`fixed left-1/2 z-50 w-[calc(100vw-2rem)] flex-col gap-3 rounded-lg bg-white p-4 shadow-lg sm:absolute sm:w-[222px] ${className}`}
          >
            <button
              type="button"
              className="flex w-full items-center gap-3 p-2 transition-colors hover:bg-gray-50 focus:outline-none"
              onClick={reactToPrintFn}
            >
              <Icon name="icon-pdf" size="w-6 h-6" />
              <p className="text-sm">{t("actions.downloadPdf")}</p>
            </button>

            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-md p-2 transition-colors hover:bg-gray-50 focus:outline-none"
              onClick={handleDuplicateClick}
            >
              <Icon name="icon-pencil" size="w-6 h-6" />
              <p className="text-sm">{t("actions.duplicate")}</p>
            </button>

            {onEditClick && (
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-md p-2 transition-colors hover:bg-gray-50 focus:outline-none"
                onClick={() => {
                  onEditClick();
                  setIsPopupOpen(false);
                }}
              >
                <Icon name="icon-edit" size="w-6 h-6" />
                <p className="text-sm">{t("actions.edit")}</p>
              </button>
            )}

            <div className="mt-2 w-full border-t border-gray-200 pt-2">
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-md p-2 text-red-500 transition-colors hover:bg-red-50 focus:outline-none"
                onClick={handleDeleteTrigger}
              >
                <Icon name="icon-delete" size="w-6 h-6" />
                <p className="text-sm">{t("actions.delete")}</p>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
