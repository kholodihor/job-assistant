import dynamic from "next/dynamic";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";
import "react-quill-new/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { WorkExperienceValues } from "../schema";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="h-[200px] w-full animate-pulse rounded-md bg-slate-100" />
  ),
});

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "unordered" }, { list: "bullet" }],
    ["link", "clean"],
  ],
};

interface WorkExperienceItemProps {
  id: string;
  form: UseFormReturn<WorkExperienceValues>;
  index: number;
  remove: (index: number) => void;
}

export const WorkExperienceItem = ({
  id,
  form,
  index,
  remove,
}: WorkExperienceItemProps) => {
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
          {t("labels.workExperience")} {index + 1}
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
          name={`workExperiences.${index}.position`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("labels.position")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={t("labels.position")}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`workExperiences.${index}.company`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("labels.company")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={t("labels.company")}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name={`workExperiences.${index}.startDate`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("labels.startDate")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="date"
                    value={field.value?.slice(0, 10)}
                    placeholder={t("labels.startDate")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`workExperiences.${index}.endDate`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("labels.endDate")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="date"
                    value={field.value?.slice(0, 10)}
                    placeholder={t("labels.endDate")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormDescription>
          {t("workExperience.endDateDescription")}
        </FormDescription>

        <FormField
          control={form.control}
          name={`workExperiences.${index}.description`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("labels.description")}</FormLabel>
              <FormControl>
                <ReactQuill
                  {...field}
                  value={field.value || ""}
                  onChange={field.onChange}
                  placeholder="Add more details"
                  modules={modules}
                  theme="snow"
                  className="w-full"
                />
              </FormControl>
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
          {t("workExperience.remove")}
        </Button>
      </div>
    </div>
  );
};
