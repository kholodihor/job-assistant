"use client";

import React, { ReactNode, createContext, useContext, useState } from "react";
import { Alert } from "@/components/shared/alert";

interface AlertOptions {
  title: string;
  description: string;
  cancelText?: string;
  confirmText?: string;
  loadingText?: string;
  isLoading?: boolean;
  variant?: "default" | "destructive";
  onConfirm: () => void;
  onCancel?: () => void;
}

interface AlertContextType {
  showAlert: (options: AlertOptions) => void;
  hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alertOptions, setAlertOptions] = useState<AlertOptions | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const showAlert = (options: AlertOptions) => {
    setAlertOptions(options);
    setIsOpen(true);
  };

  const hideAlert = () => {
    setIsOpen(false);
    setTimeout(() => {
      setAlertOptions(null);
    }, 200);
  };

  const handleCancel = () => {
    if (alertOptions?.onCancel) {
      alertOptions.onCancel();
    }
    hideAlert();
  };

  const handleConfirm = () => {
    if (alertOptions?.onConfirm) {
      alertOptions.onConfirm();
    }
    hideAlert();
  };

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      {alertOptions && (
        <Alert
          title={alertOptions.title}
          description={alertOptions.description}
          cancelText={alertOptions.cancelText || "Cancel"}
          confirmText={alertOptions.confirmText || "Confirm"}
          loadingText={alertOptions.loadingText}
          isLoading={alertOptions.isLoading}
          variant={alertOptions.variant}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          open={isOpen}
        />
      )}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};
