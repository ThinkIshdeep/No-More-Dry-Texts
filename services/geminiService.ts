import { GoogleGenAI, SchemaType } from "@google/genai";
import { SignalResponse, RelationshipLevel } from "../types";

// Remove the global initialization that crashes the app
// const ai = new GoogleGenAI... (DELETE THIS LINE)

const SYSTEM_INSTRUCTION = `
You are a Social Intelligence Coach. Your job is to generate conversation starters that are clever, polite, and context-aware.
Instructions:
Analyze the user's input (Text or Image) and the specified RELATIONSHIP LEVEL.
Generate exactly 3 distinct conversation starter options.

LOGIC BY RELATIONSHIP LEVEL:
1. RELATIONSHIP: "Random/Unknown" -> Polite Curiosity. Safety first.
2. RELATIONSHIP: "Single" -> Low-Stakes Charm. Playful.
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
    // 1. SAFE LOAD: Only get the key when the function runs
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    
    if (!apiKey) {
      throw new Error("API Key is missing in Vercel! Check Environment Variables.");
    }

    // 2. INITIALIZE HERE: Start the AI only when needed
    const ai = new GoogleGenAI({ apiKey: apiKey });

    const parts: any[] = [];
    
    if (imageBase64) {
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
      model: "gemini-2.0-flash-exp", 
      contents: { role: "user", parts: parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            observer: { type: SchemaType.STRING },
            question: { type: SchemaType.STRING },
            witty: { type: SchemaType.STRING },
          },
          required: ["observer", "question", "witty"],
        },
      },
    });

    const text = response.text();
    if (!text) throw new Error("No text returned from Gemini");

    return JSON.parse(text) as SignalResponse;

  } catch (error) {
    console.error("Error generating social advice:", error);
    throw error;
  }
};
