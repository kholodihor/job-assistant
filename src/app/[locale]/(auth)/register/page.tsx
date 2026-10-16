import { AuthError } from "@/components/auth/auth-error";
import { AuthForm } from "@/components/auth/auth-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Locale } from "@/i18n/routing";
import { requireUnAuth } from "@/utils/auth-guard";

type Params = Promise<{ locale: Locale }>;

export default async function RegisterPage(props: { params: Params }) {
  await requireUnAuth();
  const { locale } = await props.params;

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-[600px] p-[30px]">
        <CardHeader className="mb-8 p-0">
          <CardTitle className="text-center text-2xl font-semibold">
            {locale === "en" ? "Create an account" : "Створіть обліковий запис"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <AuthError />
          <AuthForm lang={locale} type="register" />
        </CardContent>
      </Card>
    </div>
  );
}
