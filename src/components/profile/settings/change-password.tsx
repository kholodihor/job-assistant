import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
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
import { ChangePasswordValues, changePasswordSchema } from "./schema";

export const ChangePassword = () => {
  const t = useTranslations("Settings");
  const tValidation = useTranslations("Settings.validation");

  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema(tValidation)),
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
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        }),
      });
      if (!res.ok) throw new Error(`Request failed with ${res.status}`);
      form.reset();
      toast.success(t("changePassword.message"));
    } catch (error) {
      toast.error(t("changePassword.error"));
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
                {t("changePassword.oldPassword")}
              </FormLabel>
              <FormControl>
                <Input
                  className="max-w-[360px]"
                  placeholder={t("changePassword.oldPassword")}
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
                {t("changePassword.newPassword")}
              </FormLabel>
              <FormControl>
                <Input
                  className="max-w-[360px]"
                  placeholder={t("changePassword.newPassword")}
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
                {t("changePassword.repeatNewPassword")}
              </FormLabel>
              <FormControl>
                <Input
                  className="max-w-[360px]"
                  placeholder={t("changePassword.repeatNewPassword")}
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
          {t("submit")}
        </button>
      </form>
    </Form>
  );
};
