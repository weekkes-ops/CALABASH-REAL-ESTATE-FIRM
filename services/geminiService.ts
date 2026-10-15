
import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

function getGenAI() {
  if (!aiInstance) {
    const apiKey = (typeof process !== 'undefined' && process.env?.API_KEY) || (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) || '';
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export const generatePropertyDescription = async (details: {
  title: string,
  price: number,
  beds: number,
  baths: number,
  location: string,
  features: string[]
}) => {
  const prompt = `Write a luxury real estate description for a property in Sierra Leone with these details:
    Title: ${details.title}
    Price: ${details.price}
    Bedrooms: ${details.beds}
    Bathrooms: ${details.baths}
    Location: ${details.location}
    Special Features: ${details.features.join(', ')}
    
    Make it professional, compelling, and ready for a listing website. Mention local Sierra Leonean appeal, security, and amenities where appropriate.`;

  try {
    const ai = getGenAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      }
    });

    return response.text || "Property description generated successfully.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating description. Please write manually.";
  }
};

