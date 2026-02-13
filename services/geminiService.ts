
import { GoogleGenAI } from "@google/genai";

export async function getSalesAdvice(target: number, current: number, unit: number) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const remaining = target - current;
  const salesNeeded = Math.ceil(remaining / unit);

  const prompt = `I have a sales target of $${target}. Currently, I have reached $${current}. 
  Each sale is worth $${unit}. I need ${salesNeeded} more sales. 
  Give me a very short, minimalist, punchy piece of advice (max 20 words) to help me stay focused and reach this target. No emojis, just plain black and white energy.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 100,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Keep pushing forward. The target is in sight.";
  }
}
