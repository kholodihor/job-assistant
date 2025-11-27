"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import PDFParser from "pdf2json";
import { env } from "@/env";

// Initialize the API client with proper env validation
function initializeGeminiAPI() {
  if (!env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  return genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
}

// Extract text from PDF using pdf2json (Next.js compatible)
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      console.log("[SERVER ACTION] Starting PDF parsing with pdf2json...");
      console.log("[SERVER ACTION] Buffer size:", buffer.length);

      // Use the TypeScript workaround from tuffstuff9/nextjs-pdf-parser
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pdfParser = new (PDFParser as any)(null, 1) as {
        on: (event: string, callback: (data: unknown) => void) => void;
        parseBuffer: (buffer: Buffer) => void;
        getRawTextContent: () => string;
      };

      pdfParser.on("pdfParser_dataError", (errData: unknown) => {
        console.error("[SERVER ACTION] pdf2json parsing error:", errData);
        const error = errData as { parserError?: string };
        reject(
          new Error(
            `PDF parsing error: ${error.parserError || "Unknown error"}`
          )
        );
      });

      pdfParser.on("pdfParser_dataReady", () => {
        try {
          console.log("[SERVER ACTION] PDF data ready, extracting text...");

          // Extract text using getRawTextContent method
          const rawText = pdfParser.getRawTextContent();

          console.log(`[SERVER ACTION] PDF parsed successfully`);
          console.log(
            `[SERVER ACTION] Extracted text length: ${rawText.length}`
          );
          console.log(
            `[SERVER ACTION] First 200 chars: ${rawText.substring(0, 200)}`
          );

          resolve(rawText);
        } catch (extractError) {
          console.error("[SERVER ACTION] Text extraction error:", extractError);
          reject(
            new Error(`Failed to extract text from PDF data: ${extractError}`)
          );
        }
      });

      // Parse the PDF buffer
      pdfParser.parseBuffer(buffer);
    } catch (error) {
      console.error("[SERVER ACTION] pdf2json setup error:", error);
      reject(new Error(`Failed to initialize PDF parser: ${error}`));
    }
  });
}

const generationConfig = {
  temperature: 0.7,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
};

export interface CVAnalysisTip {
  type: "good" | "improve";
  tip: string;
  explanation?: string;
}

export interface CVAnalysisSection {
  score: number;
  tips: CVAnalysisTip[];
}

export interface CVAnalysisFeedback {
  overallScore: number;
  ATS: CVAnalysisSection;
  toneAndStyle: CVAnalysisSection;
  content: CVAnalysisSection;
  structure: CVAnalysisSection;
  skills: CVAnalysisSection;
}

export interface CVAnalysisFormData {
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  cvFile: File;
}

export interface CVAnalysisResponse {
  feedback: CVAnalysisFeedback;
  rawResponse: string;
}

const getAnalysisPrompt = (
  formData: CVAnalysisFormData,
  cvText: string,
  locale: string = "en"
) => {
  const { companyName, jobTitle, jobDescription } = formData;

  const responseFormat = `
  interface Feedback {
    overallScore: number; //max 100
    ATS: {
      score: number; //rate based on ATS suitability
      tips: {
        type: "good" | "improve";
        tip: string; //give 3-4 tips
      }[];
    };
    toneAndStyle: {
      score: number; //max 100
      tips: {
        type: "good" | "improve";
        tip: string; //make it a short "title" for the actual explanation
        explanation: string; //explain in detail here
      }[]; //give 3-4 tips
    };
    content: {
      score: number; //max 100
      tips: {
        type: "good" | "improve";
        tip: string; //make it a short "title" for the actual explanation
        explanation: string; //explain in detail here
      }[]; //give 3-4 tips
    };
    structure: {
      score: number; //max 100
      tips: {
        type: "good" | "improve";
        tip: string; //make it a short "title" for the actual explanation
        explanation: string; //explain in detail here
      }[]; //give 3-4 tips
    };
    skills: {
      score: number; //max 100
      tips: {
        type: "good" | "improve";
        tip: string; //make it a short "title" for the actual explanation
        explanation: string; //explain in detail here
      }[]; //give 3-4 tips
    };
  }`;

  if (locale === "ua") {
    return `Ви експерт з ATS (Applicant Tracking System) та аналізу резюме.
Будь ласка, проаналізуйте та оцініть це резюме і запропонуйте, як його покращити.
Оцінка може бути низькою, якщо резюме погане.
Будьте ретельними та детальними. Не бійтеся вказувати на помилки або сфери для покращення.
Якщо є багато що покращувати, не соромтеся ставити низькі оцінки. Це допоможе користувачу покращити своє резюме.
Якщо доступно, використовуйте опис роботи, на яку подається користувач, щоб дати більш детальний відгук.

Компанія: ${companyName}
Посада: ${jobTitle}
Опис роботи: ${jobDescription}

Резюме для аналізу:
${cvText}

Надайте відгук, використовуючи наступний формат:
${responseFormat}

Поверніть аналіз як JSON об'єкт українською мовою, без будь-якого іншого тексту і без зворотних лапок.
Не включайте жодного іншого тексту або коментарів.`;
  }

  return `You are an expert in ATS (Applicant Tracking System) and resume analysis.
Please analyze and rate this resume and suggest how to improve it.
The rating can be low if the resume is bad.
Be thorough and detailed. Don't be afraid to point out any mistakes or areas for improvement.
If there is a lot to improve, don't hesitate to give low scores. This is to help the user to improve their resume.
If available, use the job description for the job user is applying to to give more detailed feedback.

Company: ${companyName}
Job Title: ${jobTitle}
Job Description: ${jobDescription}

Resume to analyze:
${cvText}

Provide the feedback using the following format:
${responseFormat}

Return the analysis as a JSON object, without any other text and without the backticks.
Do not include any other text or comments.`;
};

// Retry function for Gemini API calls with exponential backoff
async function sendMessageWithRetry(
  chatSession: {
    sendMessage: (
      prompt: string
    ) => Promise<{ response: { text: () => string } }>;
  },
  prompt: string,
  maxRetries: number = 3
): Promise<{ response: { text: () => string } }> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(
        `[SERVER ACTION] Gemini API attempt ${attempt}/${maxRetries}`
      );
      const result = await chatSession.sendMessage(prompt);
      console.log(
        `[SERVER ACTION] Gemini API call successful on attempt ${attempt}`
      );
      return result;
    } catch (error: unknown) {
      console.error(
        `[SERVER ACTION] Gemini API attempt ${attempt} failed:`,
        error
      );

      // Check if it's a 503 Service Unavailable error
      const errorObj = error as { status?: number; message?: string };
      if (
        errorObj?.status === 503 ||
        errorObj?.message?.includes("overloaded")
      ) {
        if (attempt < maxRetries) {
          // Exponential backoff: 2s, 4s, 8s
          const delay = Math.pow(2, attempt) * 1000;
          console.log(`[SERVER ACTION] Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
      }

      // If it's not a retryable error or we've exhausted retries, throw
      throw error;
    }
  }

  // This should never be reached, but TypeScript requires it
  throw new Error("Maximum retry attempts exceeded");
}

export async function analyzeCv(
  formData: CVAnalysisFormData,
  locale: string = "en"
): Promise<CVAnalysisResponse> {
  try {
    console.log("[SERVER ACTION] Starting CV analysis...");
    console.log("[SERVER ACTION] File name:", formData.cvFile.name);
    console.log("[SERVER ACTION] File size:", formData.cvFile.size);

    // Extract text from PDF file using pdf2json
    console.log("[SERVER ACTION] Converting file to buffer...");
    const arrayBuffer = await formData.cvFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    console.log("[SERVER ACTION] Buffer created, size:", buffer.length);

    // Extract text using PDF.js (pdfjs-dist)
    console.log("[SERVER ACTION] Starting PDF parsing with PDF.js...");
    const cvText = await extractTextFromPDF(buffer);

    if (!cvText || cvText.trim().length === 0) {
      throw new Error(
        "Could not extract text from PDF. The file might be image-based or corrupted."
      );
    }

    const prompt = getAnalysisPrompt(formData, cvText, locale);

    // Initialize Gemini model
    const model = initializeGeminiAPI();

    // Start chat session
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    // Send the message and get the response with retry logic
    const result = await sendMessageWithRetry(chatSession, prompt);
    const responseText = result.response.text();

    // Extract JSON from the response
    // The response might contain markdown code blocks, so we need to extract just the JSON part
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) ||
      responseText.match(/```([\s\S]*?)```/) || [null, responseText];

    const jsonString = jsonMatch[1] ? jsonMatch[1].trim() : responseText.trim();

    // Parse the JSON
    const feedback = JSON.parse(jsonString) as CVAnalysisFeedback;

    return {
      feedback,
      rawResponse: responseText,
    };
  } catch (error) {
    console.error("Error analyzing CV:", error);
    throw new Error("Failed to analyze CV. Please try again.");
  }
}
