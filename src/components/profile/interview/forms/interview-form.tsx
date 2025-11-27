import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { InterviewFormValues, interviewFormSchema } from "./schema";

interface InterviewFormProps {
  onSubmit: (data: InterviewFormValues) => void;
  onCancel: () => void;
  defaultValues?: Partial<InterviewFormValues>;
}

export const InterviewForm = ({
  onSubmit,
  onCancel,
  defaultValues = {
    position: "",
    description: "",
    techStack: [],
    yearsOfExperience: "",
  },
}: InterviewFormProps) => {
  const t = useTranslations("Form");
  const form = useForm<InterviewFormValues>({
    resolver: zodResolver(interviewFormSchema),
    defaultValues,
  });

  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <div className="mx-auto w-full max-w-md space-y-6 p-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">
          {t("steps.interview.title")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t("steps.interview.description")}
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("labels.position")}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={t("placeholders.position")} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("labels.description")}</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={t("placeholders.description")}
                    className="min-h-[100px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="techStack"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("labels.techStack")}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t("placeholders.techStack")}
                    className="min-h-[100px]"
                    value={
                      typeof field.value === "string"
                        ? field.value
                        : field.value?.join(", ") || ""
                    }
                    onChange={(e) => {
                      // Store the raw text input instead of processing it immediately
                      field.onChange(e.target.value);
                    }}
                    onBlur={(e) => {
                      // Process the input when the field loses focus
                      if (typeof e.target.value === "string") {
                        const techStack = e.target.value.split(",");
                        field.onChange(
                          techStack
                            .map((item) => item.trim())
                            .filter((item) => item !== "")
                        );
                      }
                    }}
                  />
                </FormControl>
                <FormDescription>{t("descriptions.techStack")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="yearsOfExperience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("labels.yearsOfExperience")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder={t("placeholders.yearsOfExperience")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              {t("buttons.cancel")}
            </Button>
            <Button type="submit" className="hover:bg-blue-50">
              {t("buttons.startInterview")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
