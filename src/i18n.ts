import { getRequestConfig } from "next-intl/server";

export const locales = ["en", "ua"];
export const defaultLocale = "ua";

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`../messages/${locale}.json`)).default,
}));
