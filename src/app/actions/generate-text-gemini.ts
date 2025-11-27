"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "@/env";

// Initialize the API client with a function to ensure fresh instance
function initializeGeminiAPI() {
  try {
    const apiKey = env.GEMINI_API_KEY;
    console.log("API Key configured:", !!apiKey, "Length:", apiKey?.length);

    if (!apiKey) {
      throw new Error("Gemini API key is not configured");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    console.log("Gemini model initialized successfully");
    return model;
  } catch (error) {
    console.error("Error initializing Gemini API:", error);
    throw new Error(
      `Failed to initialize Gemini API: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export async function generateTextGemini(
  letterData: {
    fullName: string;
    profession: string;
    position: string;
    company: string;
    nameRecipient: string;
    skills?: string[];
    workExperience?: Array<{
      company?: string;
      position?: string;
      description?: string;
    }>;
  },
  locale: string = "en"
) {
  const prompt =
    locale === "ua"
      ? `Створіть текст супровідного листа українською мовою на основі наступних даних:

Ім'я кандидата: **${letterData.fullName}**
Професія: **${letterData.profession}**
Ім'я отримувача: **${letterData.nameRecipient}**
Посада отримувача: **${letterData.position}**
Компанія: **${letterData.company}**
Навички: **${letterData.skills?.join(", ") || ""}**
Досвід роботи:
${
  letterData.workExperience
    ?.map(
      (exp) => `- ${exp.position} в ${exp.company}
  ${exp.description}`
    )
    .join("\n") || ""
}

### **Інструкції:**
- Використовуйте точні передані значення для отримувача, компанії та інших даних. **Не змінюйте ці дані та не вигадуйте інші імена чи назви.**
- Напишіть чітке введення, яке підкреслює мотивацію та зацікавленість у вакансії (максимум 2 речення).
- Використовуйте професійну ділову українську мову.
- Пишіть від першої особи.
- Зосередьтеся на тому, чому кандидат підходить для цієї ролі, підкреслюючи його сильні сторони та досягнення.
- Використовуйте активні дієслова.
- Текст має містити 50-100 слів і не перевищувати 700 символів та пів сторінки.

### **Приклад формату:**
"Шановний(а) **${letterData.nameRecipient}**,

Зацікавившись позицією **${letterData.profession}** у вашій компанії **${letterData.company}**, я подаю свою кандидатуру.

Мій досвід у [ключові навички] дозволяє мені ефективно виконувати [ключові обов'язки]. Вірю, що мої знання та ентузіазм принесуть користь вашій команді."

**Згенеруйте унікальний супровідний лист, не змінюючи передані дані.**`
      : `Create a cover letter text based on the following details:

Candidate Name: **${letterData.fullName}**
Profession: **${letterData.profession}**
Recipient Name: **${letterData.nameRecipient}**
Recipient Position: **${letterData.position}**
Company: **${letterData.company}**
Skills: **${letterData.skills?.join(", ") || ""}**
Work Experience:
${
  letterData.workExperience
    ?.map(
      (exp) => `- ${exp.position} at ${exp.company}
  ${exp.description}`
    )
    .join("\n") || ""
}

### **Instructions:**
- Use the exact provided values for recipient name, company name, and other details. **Do not modify or invent different names or company names.**
- Write a clear introduction that emphasizes motivation and interest in the position (maximum 2 sentences).
- Use professional business English.
- Write in the first person.
- Focus on why the candidate is a good fit for the role, highlighting strengths and achievements.
- Use active verbs.
- Keep the text between 50-100 words and no more than 700 symbols and half a page.

### **Example format:**
"Dear **${letterData.nameRecipient}**,

I am excited to apply for the **${letterData.profession}** position at **${letterData.company}**.

With my expertise in [key skills], I am confident in my ability to contribute effectively to [specific responsibilities]. I believe my knowledge and enthusiasm will be valuable to your team."

**Generate a unique professional cover letter without modifying the given data.**`;

  try {
    // Initialize a fresh model instance for each request
    const model = initializeGeminiAPI();
    console.log("Model initialized with new instance");

    console.log("Starting text generation with data:", {
      fullName: letterData.fullName,
      profession: letterData.profession,
      position: letterData.position,
      company: letterData.company,
      nameRecipient: letterData.nameRecipient,
      skillsCount: letterData.skills?.length,
      workExperienceCount: letterData.workExperience?.length,
      locale,
    });

    if (
      !letterData.fullName ||
      !letterData.profession ||
      !letterData.position ||
      !letterData.company
    ) {
      throw new Error("Missing required fields for text generation");
    }

    // Model is already initialized and tested
    console.log("Model initialized");

    console.log("Generating content with prompt length:", prompt.length);
    const result = await model.generateContent(prompt);
    console.log("Content generated, getting response");

    const response = await result.response;
    console.log("Got response, extracting text");

    const text = response.text();
    console.log("Text extracted, length:", text.length);

    if (!text) {
      throw new Error("Generated text is empty");
    }

    return text.trim();
  } catch (error) {
    console.error("Error generating the text with Gemini:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate the text: ${error.message}`);
    } else {
      throw new Error("Failed to generate the text: Unknown error");
    }
  }
}
