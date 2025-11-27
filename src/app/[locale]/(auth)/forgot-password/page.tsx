import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { Locale } from "@/i18n/routing";

type Params = Promise<{ locale: Locale }>;

export default async function ForgotPasswordPage(props: { params: Params }) {
  const { locale } = await props.params;

  return <ForgotPasswordForm lang={locale} />;
}
