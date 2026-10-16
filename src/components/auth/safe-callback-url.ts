export const DEFAULT_CALLBACK_URL = "/profile/dashboard";

/**
 * Only allow same-origin relative paths ("/foo"), rejecting protocol-relative
 * ("//evil.com") and backslash ("/\\evil.com") forms that browsers treat as
 * absolute URLs.
 */
export function getSafeCallbackUrl(value: string | null | undefined): string {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.startsWith("/\\")
  ) {
    return DEFAULT_CALLBACK_URL;
  }
  return value;
}
