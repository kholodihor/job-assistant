import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const variants = {
  error: {
    box: "border-red-200 bg-red-50",
    title: "text-red-700",
    text: "text-red-600",
  },
  warning: {
    box: "border-amber-200 bg-amber-50",
    title: "text-amber-700",
    text: "text-amber-600",
  },
};

interface StatusScreenProps {
  variant: keyof typeof variants;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}

export const StatusScreen = ({
  variant,
  title,
  description,
  actionLabel,
  onAction,
}: StatusScreenProps) => {
  const styles = variants[variant];
  return (
    <div className="container mx-auto py-12 text-center">
      <div className={cn("inline-block rounded-lg border p-6", styles.box)}>
        <h2 className={cn("mb-2 text-xl font-semibold", styles.title)}>
          {title}
        </h2>
        <p className={styles.text}>{description}</p>
        <Button variant="outline" className="mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      </div>
    </div>
  );
};
