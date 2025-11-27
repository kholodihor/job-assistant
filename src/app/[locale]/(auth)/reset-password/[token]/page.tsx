import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { Locale } from "@/i18n/routing";

type Params = Promise<{ token: string; locale: Locale }>;

export default async function ResetPasswordPage(props: { params: Params }) {
  const { token, locale } = await props.params;
  return <ResetPasswordForm token={token} lang={locale} />;
}
