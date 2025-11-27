"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { InterviewFormValues } from "@/components/profile/interview/forms/schema";

// Make sure to add GEMINI_API_KEY to your .env file
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
};

export interface InterviewQuestion {
  Question: string;
  Answer: string;
}

export interface InterviewResponse {
  questions: InterviewQuestion[];
  rawResponse: string;
}

export async function generateInterview(
  formData: InterviewFormValues,
  locale: string = "en"
): Promise<InterviewResponse> {
  try {
    // Extract values from form data
    const { position, description, techStack, yearsOfExperience } = formData;

    // Create prompt for Gemini based on locale
    let prompt = "";

    if (locale === "ua") {
      prompt = `Посада: ${position}

Опис посади: ${description}

Технічний стек: ${techStack.join(", ")}

Роки досвіду: ${yearsOfExperience}

На основі цієї інформації, згенеруйте 5 питань для співбесіди з прикладами відповідей у форматі JSON українською мовою. Кожне питання має бути релевантним до посади, технічного стеку та рівня досвіду. Поверніть тільки валідний JSON масив з полями Question та Answer для кожного елемента.`;
    } else {
      prompt = `Job Position: ${position}

Job Description: ${description}

Tech Stack: ${techStack.join(", ")}

Years of Experience: ${yearsOfExperience}

Based on this information, generate 5 interview questions with sample answers in JSON format. Each question should be relevant to the position, tech stack, and experience level. Return only a valid JSON array with Question and Answer fields for each item.`;
    }

    // Start chat session
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    // Send the message and get the response
    const result = await chatSession.sendMessage(prompt);
    const responseText = result.response.text();

    // Extract JSON from the response
    // The response might contain markdown code blocks, so we need to extract just the JSON part
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) ||
      responseText.match(/```([\s\S]*?)```/) || [null, responseText];

    const jsonString = jsonMatch[1] ? jsonMatch[1].trim() : responseText.trim();

    // Parse the JSON
    const questions = JSON.parse(jsonString) as InterviewQuestion[];

    return {
      questions,
      rawResponse: responseText,
    };
  } catch (error) {
    console.error("Error generating interview questions:", error);
    throw new Error(
      "Failed to generate interview questions. Please try again."
    );
  }
}
