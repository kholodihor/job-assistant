import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
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
import { EditorFormProps } from "@/types/letter";
import { personalInfoSchema } from "./schema";

export const PersonalInfoForm = ({
  letterData,
  setLetterData,
}: EditorFormProps) => {
  const t = useTranslations("FormLetter");

  const form = useForm({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: letterData?.name || "",
      location: letterData?.location || "",
      phone: letterData?.phone || "",
      email: letterData?.email || "",
    },
  });

  useEffect(() => {
    const { unsubscribe } = form.watch((values) => {
      setLetterData({ ...letterData, ...values });
    });
    return unsubscribe;
  }, [form, letterData, setLetterData]);

  return (
    <div className="mx-auto w-full max-w-md space-y-6 p-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("steps.personalInfo.title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("steps.personalInfo.description")}
        </p>
      </div>

      <Form {...form}>
        <form className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("labels.name")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("placeholders.name")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("labels.location")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("placeholders.location")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("labels.phone")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("placeholders.phone")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("labels.email")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("placeholders.email")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};
