import { GoogleGenAI, SchemaType } from "@google/genai";
import { SignalResponse, RelationshipLevel } from "../types";

// FIX: Use import.meta.env to access the variable in Vite/Vercel
const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

// Safety check to warn you in the console if the key is missing
if (!apiKey) {
  console.error("⚠️ API Key is missing! Check your Vercel Environment Variables.");
}

// Initialize the client
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
    
    // FIX: Handle Image Mime Types dynamically
    if (imageBase64) {
      // 1. Extract the mime type (e.g., 'image/png') from the base64 string
      const mimeType = imageBase64.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)?.[1] || "image/jpeg";
      
      // 2. Extract just the data (remove the "data:image/..." prefix)
      const base64Data = imageBase64.split(',')[1] || imageBase64;

      parts.push({
        inlineData: {
          mimeType: mimeType,
          data: base64Data
        }
      });
    }

    // Add the text prompt
    parts.push({
      text: `Context/Input: "${targetDetail}"\nRelationship Level: "${relationship}"`
    });

    // Call the API
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp", // You can change this to "gemini-1.5-flash" if 2.0 is unstable
      contents: { role: "user", parts: parts },
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

    const text = response.text();
    if (!text) throw new Error("No text returned from Gemini");

    return JSON.parse(text) as SignalResponse;

  } catch (error) {
    console.error("Error generating social advice:", error);
    throw error;
  }
};
