import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { handleRouteError, notFound, unauthorized } from "@/lib/api";

vi.mock("@/lib/auth", () => ({ auth: { api: { getSession: vi.fn() } } }));
vi.mock("next/headers", () => ({ headers: vi.fn() }));

afterEach(() => {
  vi.restoreAllMocks();
});

describe("handleRouteError", () => {
  it("maps a ZodError to 400 with the validation issues", async () => {
    const result = z.object({ email: z.string() }).safeParse({ email: 1 });
    if (result.success) throw new Error("expected parse failure");

    const res = handleRouteError(result.error, "Failed to save");
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.message).toBe("Invalid request data");
    expect(Array.isArray(body.errors)).toBe(true);
    expect(body.errors[0].path).toEqual(["email"]);
  });

  it("maps any other error to 500 without leaking error details", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const error = new Error("db password is hunter2");

    const res = handleRouteError(error, "Failed to save");
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body).toEqual({ message: "Failed to save" });
    expect(JSON.stringify(body)).not.toContain("hunter2");
    expect(consoleError).toHaveBeenCalledWith("Failed to save", error);
  });

  it("handles non-Error throwables as 500", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const res = handleRouteError("boom", "Oops");
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ message: "Oops" });
  });
});

describe("response helpers", () => {
  it("unauthorized() returns 401", async () => {
    const res = unauthorized();
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ message: "Unauthorized" });
  });

  it("notFound() returns 404 with the given message", async () => {
    const res = notFound("X");
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ message: "X" });
  });

  it("notFound() defaults its message", async () => {
    expect(await notFound().json()).toEqual({ message: "Not found" });
  });
});
