import { GoogleGenerativeAI, type ModelParams } from "@google/generative-ai";
import { env } from "@/env";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

export const getGeminiModel = (params: ModelParams) =>
  genAI.getGenerativeModel(params);

/** Parses JSON from a model reply, unwrapping a ``` fenced block if present. */
export function parseJsonResponse<T>(text: string): T {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return JSON.parse((fenced ? fenced[1] : text).trim()) as T;
}
