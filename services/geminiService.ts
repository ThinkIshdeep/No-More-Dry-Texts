import { GoogleGenAI, SchemaType } from "@google/genai"; // Note: Use SchemaType if Type isn't working
import { SignalResponse, RelationshipLevel } from "../types";

// FIX 1: Use import.meta.env for Vite and ensure variable starts with VITE_
const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

if (!apiKey) {
  console.error("API Key is missing! Check your .env file.");
}

const ai = new GoogleGenAI({ apiKey: apiKey });

const SYSTEM_INSTRUCTION = `
You are a Social Intelligence Coach. Your job is to generate conversation starters that are clever, polite, and context-aware. 

Instructions:
Analyze the user's input (Text or Image) and the specified RELATIONSHIP LEVEL.
Generate exactly 3 distinct conversation starter options based on the logic below.

LOGIC BY RELATIONSHIP LEVEL:
1. RELATIONSHIP: "Random/Unknown" -> Polite Curiosity. Safety first. No flirting.
2. RELATIONSHIP: "Single" -> Low-Stakes Charm. Playful but respectful.
3. RELATIONSHIP: "Friend" -> Relatable Vibe. Chill.
4. RELATIONSHIP: "Close Friend" -> Unhinged/Direct. Roast them.
5. RELATIONSHIP: "Partner" -> Affectionate or Roast.

OUTPUT FORMAT:
Provide exactly 3 options labeled as:
1. observer: (Focuses on a background detail/context).
2. question: (A specific, unique question to prompt a reply).
3. witty: (A lighthearted comment or joke).

Strict Rules:
* Keep it short.
* Return raw JSON matching the schema.
`;

export const generateSignal = async (targetDetail: string, relationship: RelationshipLevel, imageBase64?: string): Promise<SignalResponse> => {
  try {
    const parts: any[] = [];
    
    // FIX 2: Dynamic Mime Type Handling
    if (imageBase64) {
      // Detect mime type from the base64 string header (e.g., data:image/png;base64,...)
      const mimeType = imageBase64.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)?.[1] || "image/jpeg";
      const base64Data = imageBase64.split(',')[1] || imageBase64;

      parts.push({
        inlineData: {
          mimeType: mimeType,
          data: base64Data
        }
      });
    }

    parts.push({
      text: `Context/Input: "${targetDetail}"\nRelationship Level: "${relationship}"`
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp", // Update to a stable model ID if 'preview' fails, or keep 'gemini-1.5-flash'
      contents: { role: "user", parts: parts }, // 'role' is often required in the new SDK structure
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            observer: { type: SchemaType.STRING, description: "Background detail opener" },
            question: { type: SchemaType.STRING, description: "Specific question opener" },
            witty: { type: SchemaType.STRING, description: "Playful opener" },
          },
          required: ["observer", "question", "witty"],
        },
      },
    });

    const text = response.text(); // Note: In newer SDKs, text might be a function: text()
    if (!text) throw new Error("No text returned from Gemini");

    return JSON.parse(text) as SignalResponse;

  } catch (error) {
    console.error("Error generating social advice:", error);
    throw error;
  }
};
