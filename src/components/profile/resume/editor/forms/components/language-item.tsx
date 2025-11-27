import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { LanguageValues } from "../schema";

const languageLevels = [
  "A1 - Beginner",
  "A2 - Elementary",
  "B1 - Intermediate",
  "B2 - Upper Intermediate",
  "C1 - Advanced",
  "C2 - Proficient",
  "Native",
];

interface LanguageItemProps {
  id: string;
  form: UseFormReturn<LanguageValues>;
  index: number;
  remove: (index: number) => void;
}

export const LanguageItem = ({
  id,
  form,
  index,
  remove,
}: LanguageItemProps) => {
  const t = useTranslations("Form");

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <div
      className={cn(
        "space-y-3 rounded-md border bg-background p-3",
        isDragging && "relative z-50 cursor-grab shadow-xl"
      )}
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <div className="flex justify-between gap-2">
        <span className="font-semibold">
          {t("labels.languageName")} {index + 1}
        </span>
        <GripHorizontal
          className="size-5 cursor-grab text-muted-foreground focus:outline-none"
          {...attributes}
          {...listeners}
        />
      </div>

      <div className="grid gap-3">
        <FormField
          control={form.control}
          name={`languages.${index}.language`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("labels.languageName")}</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`languages.${index}.level`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("labels.languageLevel")}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("placeholders.languageLevel")}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {languageLevels.map((level) => (
                    <SelectItem key={level} value={level.split(" - ")[0]}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-destructive"
          onClick={() => remove(index)}
        >
          {t("languages.remove")}
        </Button>
      </div>
    </div>
  );
};
