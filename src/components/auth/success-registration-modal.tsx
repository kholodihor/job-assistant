"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Locale } from "@/i18n/routing";

interface SuccessRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Locale;
}

export function SuccessRegistrationModal({
  isOpen,
  onClose,
  lang,
}: SuccessRegistrationModalProps) {
  const router = useRouter();

  const handleHomeClick = () => {
    router.push(`/${lang}`);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        lang === "en" ? "Registration Successful" : "Реєстрація пройшла успішно"
      }
    >
      <div className="flex flex-col items-center justify-center space-y-6 p-6 text-center">
        <h2 className="text-2xl font-semibold">
          {lang === "en"
            ? "Registration Successful"
            : "Реєстрація пройшла успішно"}
        </h2>
        <Button
          onClick={handleHomeClick}
          className="w-full rounded-[40px] bg-blue-500 py-2.5 text-base text-white hover:bg-blue-600 focus:bg-blue-600"
        >
          {lang === "en" ? "Go to Home" : "На головну"}
        </Button>
      </div>
    </Modal>
  );
}
