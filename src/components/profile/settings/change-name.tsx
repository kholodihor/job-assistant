import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Locale } from "@/i18n/routing";
import { ChangeNameValues, changeNameSchema } from "./schema";

export const ChangeForm = () => {
  const t = useTranslations("Settings");
  const lang = useLocale() as Locale;
  const { data: session, update } = useSession();

  async function handleSubmit(values: ChangeNameValues) {
    const { name } = values;

    try {
      await fetch("/api/change-name", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      toast.success(t("changeName.message"));
      if (session?.user) {
        await update({
          ...session,
          user: {
            ...session?.user,
            name,
          },
        });
      }
    } catch (error) {
      toast.error(t("changeName.error"));
      console.error("Error submitting form:", error);
    }
  }

  const form = useForm<ChangeNameValues>({
    resolver: zodResolver(changeNameSchema(lang)),
    defaultValues: {
      name: session?.user.name || "",
      email: session?.user.email || "",
    },
  });

  return (
    <Form {...form}>
      <form
        className="fl mt-8 flex flex-col gap-y-4"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-h4">
                {lang === "en" ? "Name" : "Ім'я"}
              </FormLabel>
              <FormControl>
                <Input
                  className="max-w-[360px]"
                  placeholder={lang === "en" ? "Your name" : "Вкажіть ім'я"}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <button
          className="max-w-[360px] rounded-[100px] bg-blue-500 px-[45px] py-[12px] text-white hover:bg-blue-600"
          type="submit"
        >
          {lang === "en" ? "Change" : "Змінити"}
        </button>
      </form>
    </Form>
  );
};
