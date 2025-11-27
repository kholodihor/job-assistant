import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import {
  Form,
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
import { templates } from "@/constants";
import { EditorFormProps } from "@/types/resume";
import { GeneralInfoFormValues, generalInfoSchema } from "./schema";

export const GeneralInfoForm = ({
  resumeData,
  setResumeData,
}: EditorFormProps) => {
  const locale = useLocale();
  const form = useForm<GeneralInfoFormValues>({
    resolver: zodResolver(generalInfoSchema),
    defaultValues: {
      template: resumeData?.template || templates.CLASSIC,
      title: resumeData?.title || "",
    },
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;
      setResumeData({ ...resumeData, ...values });
    });
    return unsubscribe;
  }, [form, resumeData, setResumeData]);

  return (
    <div className="mx-auto w-full max-w-md space-y-6 p-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {locale === "en" ? "General Information" : "Загальна інформація"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {locale === "en"
            ? "This information will be displayed on your resume."
            : "Ця інформація буде відображена на вашому резюме."}
        </p>
      </div>

      <Form {...form}>
        <form className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {locale === "en" ? "Resume Title" : "Назва резюме"}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={locale === "en" ? "My Resume" : "Моє резюме"}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="template"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{locale === "en" ? "Template" : "Шаблон"}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          locale === "en"
                            ? "Select template"
                            : "Виберіть шаблон"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={templates.CLASSIC}>Classic</SelectItem>
                    <SelectItem value={templates.MODERN_DARK}>
                      Modern Dark
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};
