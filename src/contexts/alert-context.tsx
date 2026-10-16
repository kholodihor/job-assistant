"use client";

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearHideTimeout = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  useEffect(() => clearHideTimeout, []);

  const showAlert = useCallback((options: AlertOptions) => {
    // Don't let a pending hide from a previous alert wipe this one
    clearHideTimeout();
    setAlertOptions(options);
    setIsOpen(true);
  }, []);

  const hideAlert = useCallback(() => {
    setIsOpen(false);
    clearHideTimeout();
    // Keep the content mounted while the close animation plays
    hideTimeoutRef.current = setTimeout(() => {
      hideTimeoutRef.current = null;
      setAlertOptions(null);
    }, 200);
  }, []);

  const handleCancel = () => {
    alertOptions?.onCancel?.();
    hideAlert();
  };

  const handleConfirm = () => {
    alertOptions?.onConfirm();
    hideAlert();
  };

  const value = useMemo(
    () => ({ showAlert, hideAlert }),
    [showAlert, hideAlert]
  );

  return (
    <AlertContext.Provider value={value}>
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
