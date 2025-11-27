"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function checkAnswer(
  question: string,
  answer: string,
  expectedAnswer: string,
  techStack: string[],
  locale: string = "en"
) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt =
      locale === "ua"
        ? `
    Як технічний інтерв'юер, оцініть відповідь кандидата на наступне питання.
    
    Питання: ${question}
    
    Очікувана відповідь: ${expectedAnswer}
    
    Відповідь кандидата: ${answer}
    
    Технічний контекст: Це для позиції ${techStack.join(", ")}.
    
    Будь ласка, надайте коротку оцінку, яка включає:
    1. Оцінка (0-10)
    2. Що було добре у відповіді
    3. Що можна покращити
    4. Будь-які технічні неточності
    
    Відформатуйте відповідь у JSON:
    {
      "score": number,
      "positives": "string",
      "improvements": "string",
      "technicalIssues": "string"
    }
    `
        : `
    As a technical interviewer, evaluate the candidate's answer to the following interview question.
    
    Question: ${question}
    
    Expected Answer: ${expectedAnswer}
    
    Candidate's Answer: ${answer}
    
    Technical Context: This is for a ${techStack.join(", ")} position.
    
    Please provide a brief evaluation that includes:
    1. Score (0-10)
    2. What was good about the answer
    3. What could be improved
    4. Any technical inaccuracies
    
    Format your response in JSON:
    {
      "score": number,
      "positives": "string",
      "improvements": "string",
      "technicalIssues": "string"
    }
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    try {
      // Extract the JSON part from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }

      const feedback = JSON.parse(jsonMatch[0]);
      return feedback;
    } catch (e) {
      console.error("Error parsing AI response:", e);
      throw new Error("Failed to parse AI feedback");
    }
  } catch (error) {
    console.error("Error checking answer:", error);
    throw error;
  }
}
