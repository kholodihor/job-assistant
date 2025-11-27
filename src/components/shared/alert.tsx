import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface AlertProps {
  title: string;
  description: string;
  cancelText: string;
  confirmText: string;
  loadingText?: string;
  isLoading?: boolean;
  variant?: "default" | "destructive";
  onConfirm: () => void;
  onCancel?: () => void;
  open?: boolean;
}

export const Alert = ({
  title,
  description,
  cancelText,
  confirmText,
  loadingText,
  isLoading = false,
  variant = "default",
  onConfirm,
  onCancel,
  open = false,
}: AlertProps) => {
  if (!open) return null;

  return (
    <AlertDialog defaultOpen={true}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={cn(
              variant === "destructive" &&
                "border-red-400 bg-red-400 hover:border-red-600 hover:bg-red-600",
              "transition-colors"
            )}
            disabled={isLoading}
          >
            {isLoading ? loadingText : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
