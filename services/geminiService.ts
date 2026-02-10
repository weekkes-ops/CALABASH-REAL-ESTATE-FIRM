
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating description. Please write manually.";
  }
};
