import { describe, expect, it } from "vitest";
import { getInitials } from "@/components/homepage/header/get-initials";

describe("getInitials", () => {
  it("takes the first letter of the first two words", () => {
    expect(getInitials("John Doe")).toBe("JD");
    expect(getInitials("John Ronald Reuel Tolkien")).toBe("JR");
  });

  it("ignores extra whitespace", () => {
    expect(getInitials("  john \t  doe  ")).toBe("JD");
  });

  it("handles a single name", () => {
    expect(getInitials("cher")).toBe("C");
  });

  it("uppercases non-Latin letters", () => {
    expect(getInitials("ігор холод")).toBe("ІХ");
  });

  it.each(["", "   ", null, undefined])(
    "returns the fallback for %p",
    (name) => {
      expect(getInitials(name)).toBe("??");
      expect(getInitials(name, "U")).toBe("U");
    }
  );
});
