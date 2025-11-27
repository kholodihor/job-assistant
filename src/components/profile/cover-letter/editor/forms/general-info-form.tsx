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
import { lettersTemplates } from "@/constants";
import { EditorFormProps } from "@/types/letter";
import { GeneralInfoFormValues, generalInfoSchema } from "./schema";

export const GeneralInfoForm = ({
  letterData,
  setLetterData,
}: EditorFormProps) => {
  const locale = useLocale();
  const form = useForm<GeneralInfoFormValues>({
    resolver: zodResolver(generalInfoSchema),
    defaultValues: {
      template: letterData?.template || lettersTemplates.SHORT,
      title: letterData?.title || "",
    },
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;
      setLetterData({ ...letterData, ...values });
    });
    return unsubscribe;
  }, [form, letterData, setLetterData]);

  return (
    <div className="mx-auto w-full max-w-md space-y-6 p-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {locale === "en" ? "General Information" : "Загальна інформація"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {locale === "en"
            ? "This information will be displayed on your resume."
            : "Ця інформація буде відображена у вашому листі."}
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
                  {locale === "en" ? "Letter Title" : "Назва листа"}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={locale === "en" ? "My Letter" : "Мій лист"}
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
                            ? "Select a template of the letter"
                            : "Виберіть шаблон листа"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={lettersTemplates.SHORT}>
                      Short
                    </SelectItem>
                    <SelectItem value={lettersTemplates.DETAILED}>
                      Detailed
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
