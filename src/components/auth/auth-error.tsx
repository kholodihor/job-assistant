"use client";

import { useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function AuthError() {
  const t = useTranslations("Auth");
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const email = searchParams.get("email");

  if (!error) return null;

  const errorMessages: Record<string, string> = {
    OAuthAccountNotLinked: t("errors.oauthAccountNotLinked"),
    UseCredentials: t("errors.useCredentials", { email: email || "" }),
    CredentialsSignin: t("errors.credentialsSignin"),
    UserNotFound: t("errors.userNotFound"),
    InvalidCredentials: t("errors.invalidCredentials"),
    EmailExists: t("errors.emailExists"),
    default: t("errors.default"),
  };

  const errorMessage = errorMessages[error] || errorMessages.default;

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="ml-2">{errorMessage}</AlertDescription>
    </Alert>
  );
}
