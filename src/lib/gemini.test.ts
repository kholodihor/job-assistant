import { describe, expect, it, vi } from "vitest";
import { parseJsonResponse } from "@/lib/gemini";

vi.mock("@/env", () => ({ env: { GEMINI_API_KEY: "test" } }));

describe("parseJsonResponse", () => {
  it("parses plain JSON", () => {
    expect(parseJsonResponse('{"a":1}')).toEqual({ a: 1 });
  });

  it("parses plain JSON with surrounding whitespace", () => {
    expect(parseJsonResponse('  \n{"a":1}\n ')).toEqual({ a: 1 });
  });

  it("unwraps a ```json fenced block", () => {
    expect(parseJsonResponse('```json\n{"a":1}\n```')).toEqual({ a: 1 });
  });

  it("unwraps a ```JSON fenced block (case-insensitive)", () => {
    expect(parseJsonResponse('```JSON\n{"a":1}\n```')).toEqual({ a: 1 });
  });

  it("unwraps a ``` fenced block without a language", () => {
    expect(parseJsonResponse('```\n{"a":1}\n```')).toEqual({ a: 1 });
  });

  it("extracts a fenced block surrounded by prose", () => {
    const text = 'Here you go:\n```json\n{"a":[1,2]}\n```\nHope it helps!';
    expect(parseJsonResponse(text)).toEqual({ a: [1, 2] });
  });

  it("parses arrays", () => {
    expect(parseJsonResponse('[{"Question":"q","Answer":"a"}]')).toEqual([
      { Question: "q", Answer: "a" },
    ]);
    expect(parseJsonResponse("```json\n[1,2,3]\n```")).toEqual([1, 2, 3]);
  });

  it("throws on invalid JSON", () => {
    expect(() => parseJsonResponse("not json")).toThrow(SyntaxError);
    expect(() => parseJsonResponse("```json\n{a:1}\n```")).toThrow(SyntaxError);
  });
});
