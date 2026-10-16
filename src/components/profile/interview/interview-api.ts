import type { InterviewQuestion, interviews } from "@/db/schema/interviews";

/** An interview row as returned (JSON-serialized) by /api/interviews. */
export type InterviewRecord = Omit<
  typeof interviews.$inferSelect,
  "createdAt"
> & { createdAt: string | null };

export async function saveInterviewQuestions(
  id: string,
  questions: InterviewQuestion[]
) {
  const response = await fetch(`/api/interviews/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ questions }),
  });
  if (!response.ok) throw new Error("Failed to save interview questions");
}
