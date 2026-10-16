import { getTranslations } from "next-intl/server";
import { AuthError } from "@/components/auth/auth-error";
import { AuthForm } from "@/components/auth/auth-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUnAuth } from "@/utils/auth-guard";

export default async function RegisterPage() {
  await requireUnAuth();
  const t = await getTranslations("Auth");

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-[600px] p-[30px]">
        <CardHeader className="mb-8 p-0">
          <CardTitle className="text-center text-2xl font-semibold">
            {t("registerTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <AuthError />
          <AuthForm type="register" />
        </CardContent>
      </Card>
    </div>
  );
}
