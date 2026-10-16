import { describe, expect, it } from "vitest";
import { resumeSchema } from "./schema";

const valid = {
  title: "My CV",
  name: "John Doe",
  email: "john@example.com",
  template: "classic",
};

describe("resumeSchema", () => {
  it("accepts a minimal resume and defaults skills/languages to []", () => {
    const parsed = resumeSchema.parse(valid);
    expect(parsed.skills).toEqual([]);
    expect(parsed.languages).toEqual([]);
    expect(parsed.educations).toBeUndefined();
  });

  it("strips a client-supplied publicId (server owns it)", () => {
    const parsed = resumeSchema.parse({ ...valid, publicId: "cvbaza/victim" });
    expect(parsed).not.toHaveProperty("publicId");
  });

  it("strips unknown keys such as userId", () => {
    const parsed = resumeSchema.parse({ ...valid, userId: "someone-else" });
    expect(parsed).not.toHaveProperty("userId");
  });

  it("rejects an invalid email", () => {
    const result = resumeSchema.safeParse({ ...valid, email: "not-an-email" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(["email"]);
    }
  });

  it("rejects a missing required field", () => {
    expect(resumeSchema.safeParse({ ...valid, title: undefined }).success).toBe(
      false
    );
  });

  it("allows a null photo", () => {
    expect(resumeSchema.parse({ ...valid, photo: null }).photo).toBeNull();
  });

  it("rejects an over-long title", () => {
    expect(
      resumeSchema.safeParse({ ...valid, title: "x".repeat(256) }).success
    ).toBe(false);
  });
});
