export type AuthContext = "register" | "signin";

// `t` is a translator scoped to the "Auth.authErrors" namespace.
export const getAuthErrorMessage = (
  error: unknown,
  context: AuthContext,
  t: (key: string) => string
): string => {
  const isError = (err: unknown): err is Error => err instanceof Error;

  const isErrorObject = (err: unknown): err is Record<string, unknown> =>
    typeof err === "object" && err !== null;

  // Network errors
  if (
    isError(error) &&
    error.name === "TypeError" &&
    error.message.includes("fetch")
  ) {
    return t("network");
  }

  // Timeout errors
  if (
    isError(error) &&
    (error.name === "AbortError" || error.message?.includes("timeout"))
  ) {
    return t("timeout");
  }

  // Rate limiting
  if (isErrorObject(error) && error.status === 429) {
    return t("rateLimited");
  }

  // Server errors
  if (
    isErrorObject(error) &&
    typeof error.status === "number" &&
    error.status >= 500
  ) {
    return t("serverError");
  }

  // Sign-in specific errors
  if (context === "signin") {
    if (typeof error === "string") {
      return error;
    }

    if (isErrorObject(error)) {
      const messageStr = typeof error.message === "string" ? error.message : "";
      const codeStr = typeof error.code === "string" ? error.code : "";
      const statusNum =
        typeof error.status === "number" ? error.status : undefined;

      if (
        codeStr === "INVALID_CREDENTIALS" ||
        statusNum === 401 ||
        /invalid credentials/i.test(messageStr) ||
        /wrong email or password/i.test(messageStr)
      ) {
        return t("invalidCredentials");
      }

      if (codeStr === "USER_NOT_FOUND") {
        return t("userNotFound");
      }

      if (codeStr === "ACCOUNT_DISABLED") {
        return t("accountDisabled");
      }

      if (messageStr) {
        return messageStr;
      }
    }
  }

  // Registration specific errors
  if (context === "register" && isErrorObject(error)) {
    const errorStr = typeof error.error === "string" ? error.error : "";
    const messageStr = typeof error.message === "string" ? error.message : "";
    const codeStr = typeof error.code === "string" ? error.code : "";

    switch (codeStr) {
      case "USER_ALREADY_EXISTS":
        return t("emailExists");
      case "VALIDATION_ERROR":
        return t("validationError");
      case "SIGN_IN_AFTER_REGISTER_FAILED":
      case "INTERNAL_SERVER_ERROR":
        return t("registrationServerError");
      default:
        break;
    }

    if (errorStr.includes("email") || messageStr.includes("email")) {
      return t("emailExists");
    }
    if (errorStr.includes("validation") || messageStr.includes("validation")) {
      return t("validationError");
    }
  }

  // Generic fallback
  let errorMessage = "";
  if (isErrorObject(error)) {
    errorMessage =
      (typeof error.error === "string" ? error.error : "") ||
      (typeof error.message === "string" ? error.message : "");
  } else if (isError(error)) {
    errorMessage = error.message;
  }

  return (
    errorMessage ||
    (context === "register"
      ? t("registrationFailed")
      : t("authenticationFailed"))
  );
};
