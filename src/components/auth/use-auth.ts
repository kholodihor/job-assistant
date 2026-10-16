"use client";

import { useTranslations } from "next-intl";
import { authClient } from "@/lib/auth-client";
import { getAuthErrorMessage } from "@/utils/auth-errors";

type SignInParams = {
  email: string;
  password: string;
  callbackUrl: string;
  rememberMe: boolean;
};

type SignUpParams = {
  email: string;
  password: string;
  name: string;
};

export const useSignIn = () => {
  const tErrors = useTranslations("Auth.authErrors");
  const signIn = async ({
    email,
    password,
    callbackUrl,
    rememberMe,
  }: SignInParams) => {
    const { error } = await authClient.signIn.email({
      email,
      password,
      callbackURL: callbackUrl,
      rememberMe,
    });

    if (error) {
      return {
        ok: false as const,
        message: getAuthErrorMessage(error, "signin", tErrors),
      };
    }

    return { ok: true as const };
  };

  return { signIn };
};

export const useSignUp = () => {
  const tErrors = useTranslations("Auth.authErrors");
  const signUp = async ({ email, password, name }: SignUpParams) => {
    const { error } = await authClient.signUp.email({
      email,
      password,
      name,
    });

    if (error) {
      return {
        ok: false as const,
        message: getAuthErrorMessage(error, "register", tErrors),
      };
    }

    return { ok: true as const };
  };

  return { signUp };
};
