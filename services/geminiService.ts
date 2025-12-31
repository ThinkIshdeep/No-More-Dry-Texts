import { GoogleGenAI, Type } from "@google/genai";
import { SignalResponse, RelationshipLevel } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are a Social Intelligence Coach. Your job is to generate conversation starters that are clever, polite, and context-aware. You avoid generic "Hellos" and cringey pickup lines.

Instructions:
Analyze the user's input (Text or Image) and the specified RELATIONSHIP LEVEL.
Generate exactly 3 distinct conversation starter options based on the logic below.

LOGIC BY RELATIONSHIP LEVEL:

1. RELATIONSHIP: "Random/Unknown (Safety First)"
    * Context: We do not know if they are single or taken.
    * Rule: Do NOT flirt. Do NOT comment on physical beauty.
    * Strategy: "Polite Curiosity." Focus strictly on the environment, the activity, the pet, or the object in the photo/text.
    * Vibe: Classy, safe, friendly, but interesting enough to get a reply.
    * Example: "That coffee spot looks amazing. Is it as quiet as it looks, or is it loud in there?"

2. RELATIONSHIP: "Target is Single (Potential Interest)"
    * Strategy: "Low-Stakes Charm." Show interest in *them*, not just the photo.
    * Vibe: Playful, intriguing, slightly confident.
    * Example: "I have to ask—what is the story behind this photo? It looks like an adventure."

3. RELATIONSHIP: "Friend (Casual)"
    * Strategy: "Relatable Vibe." Keep it breezy.
    * Vibe: Chill, zero pressure.
    * Example: "Bro, where is this? We need to go there next time."

4. RELATIONSHIP: "Close Friend (Bestie)"
    * Strategy: "Unhinged/Direct." No filter needed.
    * Vibe: Chaos, inside jokes, roasting.
    * Example: "Why are you like this? Also, send me the location immediately."

5. RELATIONSHIP: "Partner (Dating/Married)"
    * Strategy: "Affectionate or Roast."
    * Vibe: Romantic or comfortably making fun of them.
    * Example: "You look way too good here, it's actually unfair to everyone else."

OUTPUT FORMAT:
Provide exactly 3 options labeled as:
1. observer: (Focuses on a background detail/context).
2. question: (A specific, unique question to prompt a reply).
3. witty: (A lighthearted comment or joke).

IMAGE ANALYSIS:
Look for small details: books on shelves, food on plates, specific brands, pets, or weather. Use these details to prove you actually looked at the image.

Strict Rules:
* Keep it short.
* Return raw JSON matching the schema.
`;

export const generateSignal = async (targetDetail: string, relationship: RelationshipLevel, imageBase64?: string): Promise<SignalResponse> => {
  try {
    const parts: any[] = [];
    
    // Add image if present
    if (imageBase64) {
      // Remove data URL prefix if present (e.g., "data:image/jpeg;base64,")
      const base64Data = imageBase64.split(',')[1] || imageBase64;
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data
        }
      });
    }

    // Add text prompt
    parts.push({
      text: `Context/Input: "${targetDetail}"\nRelationship Level: "${relationship}"`
    });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts: parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            observer: {
              type: Type.STRING,
              description: "The Observer style opener (Background detail/context)",
            },
            question: {
              type: Type.STRING,
              description: "The Question style opener (Specific/Unique)",
            },
            witty: {
              type: Type.STRING,
              description: "The Witty/Fun style opener (Lighthearted/Joke)",
            },
          },
          required: ["observer", "question", "witty"],
        },
      },
    });

    const text = response.text;
    if (!text) {
        throw new Error("No text returned from Gemini");
    }

    // Parse the JSON response
    const data = JSON.parse(text) as SignalResponse;
    return data;

  } catch (error) {
    console.error("Error generating social advice:", error);
    throw error;
  }
};