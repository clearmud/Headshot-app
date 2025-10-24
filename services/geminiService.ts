import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generateHeadshot(base64Image: string, mimeType: string, prompt: string): Promise<string> {
    try {
        // Using 'gemini-2.5-flash-image' model, also known as 'nano banana'.
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            // FIX: The `contents` field should be an object, not an array, for this type of multimodal request.
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64Image,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: prompt,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
        
        // If no image is found, provide a more detailed error.
        const textResponse = response.text?.trim();
        if (textResponse) {
             throw new Error(`Model did not return an image. Response: "${textResponse}"`);
        }
        throw new Error("The model did not return an image. This could be due to a safety policy violation or an issue with the prompt.");

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        // Re-throw the error to be handled by the UI component
        throw error;
    }
}
