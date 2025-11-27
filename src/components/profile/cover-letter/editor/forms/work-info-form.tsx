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
import { workInfoSchema } from "./schema";

export const WorkInfoForm = ({
  letterData,
  setLetterData,
}: EditorFormProps) => {
  const t = useTranslations("FormLetter");

  const form = useForm({
    resolver: zodResolver(workInfoSchema),
    defaultValues: {
      profession: letterData?.profession || "",
      position: letterData?.position || "",
      company: letterData?.company || "",
      nameRecipient: letterData?.nameRecipient || "",
      positionRecipient: letterData?.positionRecipient || "",
    },
  });

  useEffect(() => {
    const { unsubscribe } = form.watch((values) => {
      // Only update fields that have changed and are not empty
      const updatedValues = Object.entries(values).reduce<
        Record<string, string>
      >((acc, [key, value]) => {
        if (value !== undefined && value !== "") {
          acc[key] = value;
        }
        return acc;
      }, {});
      setLetterData({ ...letterData, ...updatedValues });
    });
    return unsubscribe;
  }, [form, letterData, setLetterData]);

  return (
    <div className="mx-auto w-full max-w-md space-y-6 p-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("steps.workInfo.title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("steps.workInfo.description")}
        </p>
      </div>

      <Form {...form}>
        <form className="space-y-4">
          <FormField
            control={form.control}
            name="profession"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("labels.profession")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("placeholders.profession")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("labels.position")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("placeholders.position")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("labels.company")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("placeholders.company")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nameRecipient"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("labels.nameRecipient")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("placeholders.nameRecipient")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="positionRecipient"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("labels.positionRecipient")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("placeholders.positionRecipient")}
                    {...field}
                  />
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
