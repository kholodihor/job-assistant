import { Locale } from "@/i18n/routing";

export type AuthContext = "register" | "signin";

export const getAuthErrorMessage = (
  error: unknown,
  context: AuthContext,
  lang: Locale
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
    return lang === "en"
      ? "Network error. Please check your connection and try again."
      : "Помилка мережі. Перевірте підключення та спробуйте ще раз.";
  }

  // Timeout errors
  if (
    isError(error) &&
    (error.name === "AbortError" || error.message?.includes("timeout"))
  ) {
    return lang === "en"
      ? "Request timed out. Please try again."
      : "Час очікування вичерпано. Спробуйте ще раз.";
  }

  // Rate limiting
  if (isErrorObject(error) && error.status === 429) {
    return lang === "en"
      ? "Too many attempts. Please wait a few minutes before trying again."
      : "Забагато спроб. Зачекайте кілька хвилин перед повторною спробою.";
  }

  // Server errors
  if (
    isErrorObject(error) &&
    typeof error.status === "number" &&
    error.status >= 500
  ) {
    return lang === "en"
      ? "Server error. Please try again later."
      : "Помилка сервера. Спробуйте пізніше.";
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
        return lang === "en"
          ? "Email or password is incorrect. Please check your credentials and try again."
          : "Невірний email або пароль. Перевірте свої дані та спробуйте ще раз.";
      }

      if (codeStr === "USER_NOT_FOUND") {
        return lang === "en"
          ? "No account found for this email. Please register first or use a different email."
          : "Обліковий запис з таким email не знайдено. Зареєструйтеся або використайте інший email.";
      }

      if (codeStr === "ACCOUNT_DISABLED") {
        return lang === "en"
          ? "Your account has been disabled. Please contact support if you think this is a mistake."
          : "Ваш обліковий запис було відключено. Зверніться в підтримку, якщо вважаєте, що це помилка.";
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
        return lang === "en"
          ? "This email is already registered. Please use a different email or sign in."
          : "Цей email вже зареєстрований. Використайте інший email або увійдіть.";
      case "VALIDATION_ERROR":
        return lang === "en"
          ? "Please check your input data and try again."
          : "Перевірте введені дані та спробуйте ще раз.";
      case "SIGN_IN_AFTER_REGISTER_FAILED":
      case "INTERNAL_SERVER_ERROR":
        return lang === "en"
          ? "Server error during registration. Please try again later."
          : "Помилка сервера під час реєстрації. Спробуйте пізніше.";
      default:
        break;
    }

    if (errorStr.includes("email") || messageStr.includes("email")) {
      return lang === "en"
        ? "This email is already registered. Please use a different email or sign in."
        : "Цей email вже зареєстрований. Використайте інший email або увійдіть.";
    }
    if (errorStr.includes("validation") || messageStr.includes("validation")) {
      return lang === "en"
        ? "Please check your input data and try again."
        : "Перевірте введені дані та спробуйте ще раз.";
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
    (lang === "en"
      ? `${
          context === "register" ? "Registration" : "Authentication"
        } failed. Please try again.`
      : `${
          context === "register" ? "Реєстрація" : "Авторизація"
        } не вдалася. Спробуйте ще раз.`)
  );
};
