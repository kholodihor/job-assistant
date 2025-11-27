"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "@/env";

// Initialize the API client with a function to ensure fresh instance
function initializeGeminiAPI() {
  const apiKey = env.GEMINI_API_KEY;
  console.log("API Key configured:", !!apiKey, "Length:", apiKey?.length);

  if (!apiKey) {
    throw new Error("Gemini API key is not configured");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  console.log("Gemini model initialized successfully");
  return model;
}

export async function generateSummaryGemini(
  resumeData: {
    fullName: string;
    position: string;
    skills: string[];
    experience: Array<{
      position: string;
      company: string;
      description: string;
    }>;
    education: Array<{ degree: string; institution: string }>;
  },
  locale: string = "en"
) {
  // API key check is now handled in initializeGeminiAPI()

  const prompt =
    locale === "ua"
      ? `Створіть коротке професійне резюме українською мовою на основі наступних даних:
    Ім'я: ${resumeData.fullName}
    Посада: ${resumeData.position}
    Навички: ${resumeData.skills?.join(", ")}
    Досвід: ${resumeData.experience
      ?.map((exp) => `${exp.position} в ${exp.company}: ${exp.description}`)
      .join("\n")}
    Освіта: ${resumeData.education
      ?.map((edu) => `${edu.degree} в ${edu.institution}`)
      .join("\n")}

Інструкції:
- Напишіть стисле, але потужне професійне резюме (максимум 2 речення)
- Використовуйте професійну ділову українську мову
- Пишіть від першої особи, починаючи з "Досвідчений" або подібного професійного означення
- Зосередьтеся на ключових досягненнях та технічній експертизі
- Уникайте простого переліку технологій, натомість підкресліть їх практичне застосування
- Використовуйте активні дієслова
- Вкладіться в 50 слів

Приклад формату:
"Досвідчений [посада] з глибокою експертизою у [ключові технології]. Спеціалізуюся на [основні досягнення], маю значний досвід [ключові професійні якості]."

Згенеруйте професійне резюме за цими інструкціями, дотримуючись норм сучасної української ділової мови:`
      : `Create a brief professional first-person summary for a resume with the following details:
    Name: ${resumeData.fullName}
    Position: ${resumeData.position}
    Skills: ${resumeData.skills?.join(", ")}
    Experience: ${resumeData.experience
      ?.map((exp) => `${exp.position} at ${exp.company}: ${exp.description}`)
      .join("\n")}
    Education: ${resumeData.education
      ?.map((edu) => `${edu.degree} from ${edu.institution}`)
      .join("\n")}

Instructions:
- Write a very concise summary (2 sentences maximum)
- Write in first person ("I am", "I have")
- Focus on current role and key skills
- Start directly with "I am"
- Avoid mentioning the full name
- Keep it under 50 words

Example format:
"I am a [position] with [X] years of experience in [key skills]. I have a proven track record in [main achievements/responsibilities] and expertise in [technical specialties/domain knowledge]."

Generate a summary following these guidelines:`;

  try {
    // Initialize a fresh model instance for each request
    const model = initializeGeminiAPI();
    console.log("Model initialized with new instance");

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text.trim();
  } catch (error) {
    console.error("Error generating summary with Gemini:", error);
    throw new Error("Failed to generate summary");
  }
}
