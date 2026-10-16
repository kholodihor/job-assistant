import { describe, expect, it } from "vitest";
import {
  DEFAULT_CALLBACK_URL,
  getSafeCallbackUrl,
} from "@/components/auth/safe-callback-url";

describe("getSafeCallbackUrl", () => {
  it.each([null, undefined, ""])("returns the default for %p", (value) => {
    expect(getSafeCallbackUrl(value)).toBe(DEFAULT_CALLBACK_URL);
  });

  it("keeps same-origin relative paths with query strings", () => {
    expect(getSafeCallbackUrl("/profile/x?a=1")).toBe("/profile/x?a=1");
    expect(getSafeCallbackUrl("/")).toBe("/");
  });

  it.each([
    "//evil.com",
    "/\\evil.com",
    "https://evil.com",
    "javascript:alert(1)",
    "evil.com",
  ])("rejects open-redirect candidate %s", (value) => {
    expect(getSafeCallbackUrl(value)).toBe(DEFAULT_CALLBACK_URL);
  });
});
