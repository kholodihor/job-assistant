import { describe, expect, it } from "vitest";
import { getAuthErrorMessage } from "@/utils/auth-errors";

const t = (key: string) => key;

describe("getAuthErrorMessage", () => {
  describe("shared mappings", () => {
    it("maps fetch TypeErrors to network", () => {
      expect(
        getAuthErrorMessage(new TypeError("Failed to fetch"), "signin", t)
      ).toBe("network");
    });

    it("maps AbortError and timeout messages to timeout", () => {
      const abort = new Error("aborted");
      abort.name = "AbortError";
      expect(getAuthErrorMessage(abort, "register", t)).toBe("timeout");
      expect(
        getAuthErrorMessage(new Error("request timeout"), "signin", t)
      ).toBe("timeout");
    });

    it("maps status 429 to rateLimited", () => {
      expect(getAuthErrorMessage({ status: 429 }, "signin", t)).toBe(
        "rateLimited"
      );
    });

    it.each([500, 503])("maps status %i to serverError", (status) => {
      expect(getAuthErrorMessage({ status }, "register", t)).toBe(
        "serverError"
      );
    });
  });

  describe("signin", () => {
    it.each([
      { code: "INVALID_CREDENTIALS" },
      { status: 401 },
      { message: "Invalid credentials" },
      { message: "Wrong email or password" },
    ])("maps %o to invalidCredentials", (error) => {
      expect(getAuthErrorMessage(error, "signin", t)).toBe(
        "invalidCredentials"
      );
    });

    it("maps USER_NOT_FOUND and ACCOUNT_DISABLED codes", () => {
      expect(getAuthErrorMessage({ code: "USER_NOT_FOUND" }, "signin", t)).toBe(
        "userNotFound"
      );
      expect(
        getAuthErrorMessage({ code: "ACCOUNT_DISABLED" }, "signin", t)
      ).toBe("accountDisabled");
    });

    it("passes through string errors and unknown messages", () => {
      expect(getAuthErrorMessage("raw", "signin", t)).toBe("raw");
      expect(
        getAuthErrorMessage({ message: "Email not verified" }, "signin", t)
      ).toBe("Email not verified");
    });

    it("falls back to authenticationFailed", () => {
      expect(getAuthErrorMessage({}, "signin", t)).toBe("authenticationFailed");
      expect(getAuthErrorMessage(null, "signin", t)).toBe(
        "authenticationFailed"
      );
    });
  });

  describe("register", () => {
    it.each([
      ["USER_ALREADY_EXISTS", "emailExists"],
      ["VALIDATION_ERROR", "validationError"],
      ["SIGN_IN_AFTER_REGISTER_FAILED", "registrationServerError"],
      ["INTERNAL_SERVER_ERROR", "registrationServerError"],
    ])("maps code %s to %s", (code, key) => {
      expect(getAuthErrorMessage({ code }, "register", t)).toBe(key);
    });

    it("maps email/validation mentions in error or message", () => {
      expect(
        getAuthErrorMessage({ message: "email already taken" }, "register", t)
      ).toBe("emailExists");
      expect(
        getAuthErrorMessage({ error: "validation failed" }, "register", t)
      ).toBe("validationError");
    });

    it("does not apply signin-only mappings (401 is not invalidCredentials)", () => {
      expect(getAuthErrorMessage({ status: 401 }, "register", t)).toBe(
        "registrationFailed"
      );
    });

    it("passes through unknown messages, else registrationFailed", () => {
      expect(getAuthErrorMessage({ message: "Weird" }, "register", t)).toBe(
        "Weird"
      );
      expect(getAuthErrorMessage(undefined, "register", t)).toBe(
        "registrationFailed"
      );
    });
  });
});
