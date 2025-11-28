"use client";

import { Locale } from "@/i18n/routing";
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

export const useSignIn = (lang: Locale) => {
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
        message: getAuthErrorMessage(
          error.message ?? "Authentication failed. Please try again.",
          "signin",
          lang
        ),
      };
    }

    return { ok: true as const };
  };

  return { signIn };
};

export const useSignUp = (lang: Locale) => {
  const signUp = async ({ email, password, name }: SignUpParams) => {
    const { error } = await authClient.signUp.email({
      email,
      password,
      name,
    });

    if (error) {
      return {
        ok: false as const,
        message: getAuthErrorMessage(
          error.message ?? "Registration failed. Please try again.",
          "register",
          lang
        ),
      };
    }

    return { ok: true as const };
  };

  return { signUp };
};
