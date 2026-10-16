import { describe, expect, it } from "vitest";
import { updateInterviewSchema } from "./schema";

const qa = (i = 0) => ({ Question: `Q${i}`, Answer: `A${i}` });

describe("updateInterviewSchema", () => {
  it("accepts valid questions", () => {
    const input = { questions: [qa(1), qa(2)] };
    expect(updateInterviewSchema.parse(input)).toEqual(input);
  });

  it("accepts an empty list and exactly 20 items", () => {
    expect(updateInterviewSchema.safeParse({ questions: [] }).success).toBe(
      true
    );
    const twenty = Array.from({ length: 20 }, (_, i) => qa(i));
    expect(updateInterviewSchema.safeParse({ questions: twenty }).success).toBe(
      true
    );
  });

  it("rejects more than 20 items", () => {
    const many = Array.from({ length: 21 }, (_, i) => qa(i));
    expect(updateInterviewSchema.safeParse({ questions: many }).success).toBe(
      false
    );
  });

  it("rejects an over-long question", () => {
    const questions = [{ Question: "x".repeat(2001), Answer: "a" }];
    expect(updateInterviewSchema.safeParse({ questions }).success).toBe(false);
  });

  it("rejects an over-long answer", () => {
    const questions = [{ Question: "q", Answer: "x".repeat(10001) }];
    expect(updateInterviewSchema.safeParse({ questions }).success).toBe(false);
  });

  it("rejects missing fields and a missing questions key", () => {
    expect(
      updateInterviewSchema.safeParse({ questions: [{ Question: "q" }] })
        .success
    ).toBe(false);
    expect(updateInterviewSchema.safeParse({}).success).toBe(false);
  });
});
