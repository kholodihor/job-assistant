import { describe, expect, it } from "vitest";
import en from "../../messages/en.json";
import ua from "../../messages/ua.json";

const flattenKeys = (value: unknown, prefix = ""): string[] =>
  value !== null && typeof value === "object" && !Array.isArray(value)
    ? Object.entries(value).flatMap(([key, child]) =>
        flattenKeys(child, prefix ? `${prefix}.${key}` : key)
      )
    : [prefix];

describe("messages", () => {
  it("en.json and ua.json define the same keys", () => {
    const enKeys = new Set(flattenKeys(en));
    const uaKeys = new Set(flattenKeys(ua));
    const missingInUa = [...enKeys].filter((k) => !uaKeys.has(k)).sort();
    const missingInEn = [...uaKeys].filter((k) => !enKeys.has(k)).sort();
    expect({ missingInUa, missingInEn }).toEqual({
      missingInUa: [],
      missingInEn: [],
    });
  });
});
