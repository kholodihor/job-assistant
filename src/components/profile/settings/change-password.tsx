import { zodResolver } from "@hookform/resolvers/zod";
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
import { useSession } from "@/lib/auth-client";
import { ChangePasswordValues, changePasswordSchema } from "./schema";

export const ChangePassword = () => {
  const t = useTranslations("Settings");
  const lang = useLocale() as Locale;
  const { data: session } = useSession();
  const token = session?.user.id;

  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema(lang)),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      repeatNewPassword: "",
    },
  });

  async function handleSubmit(values: ChangePasswordValues) {
    try {
      const res = await fetch("/api/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idUser: token,
          ...values,
        }),
      });
      if (res.ok) {
        form.reset();
      }
      toast.success(t("ChangePassword.message"));
    } catch (error) {
      toast.error(t("ChangePassword.error"));
      console.error("Error submitting form:", error);
    }
  }

  return (
    <Form {...form}>
      <form
        className="fl mt-8 flex flex-col gap-y-4"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="oldPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-h4">
                {lang === "en" ? "Old password" : "Старий пароль"}
              </FormLabel>
              <FormControl>
                <Input
                  className="max-w-[360px]"
                  placeholder={lang === "en" ? "Old password" : "Старий пароль"}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-h4">
                {lang === "en" ? "New password" : "Новий пароль"}
              </FormLabel>
              <FormControl>
                <Input
                  className="max-w-[360px]"
                  placeholder={lang === "en" ? "New password" : "Новий пароль"}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="repeatNewPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-h4">
                {lang === "en"
                  ? "Repeat new password"
                  : "Повторіть новий пароль"}
              </FormLabel>
              <FormControl>
                <Input
                  className="max-w-[360px]"
                  placeholder={
                    lang === "en"
                      ? "Repeat new password"
                      : "Повторіть новий пароль"
                  }
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <button
          className="max-w-[360px] rounded-[100px] bg-blue-500 px-[45px] py-[12px] text-white"
          type="submit"
        >
          {lang === "en" ? "Change" : "Змінити"}
        </button>
      </form>
    </Form>
  );
};
