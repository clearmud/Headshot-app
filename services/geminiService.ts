import { GoogleGenAI, Modality } from "@google/genai";

class GeminiService {
    private ai: GoogleGenAI | null = null;

    initialize(apiKey: string) {
        if (!apiKey) {
            throw new Error("Gemini API key is required for initialization.");
        }
        this.ai = new GoogleGenAI({ apiKey });
        console.log("Gemini Service Initialized");
    }

    async generateHeadshot(base64Image: string, mimeType: string, prompt: string): Promise<string> {
        if (!this.ai) {
            throw new Error("Gemini Service not initialized. Please call initialize() first.");
        }
        
        try {
            // Using 'gemini-2.5-flash-image' model, also known as 'nano banana'.
            const response = await this.ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
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
            
            const textResponse = response.text?.trim();
            if (textResponse) {
                throw new Error(`Model did not return an image. Response: "${textResponse}"`);
            }
            throw new Error("The model did not return an image. This could be due to a safety policy violation or an issue with the prompt.");

        } catch (error) {
            console.error("Error calling Gemini API:", error);
            throw error;
        }
    }
}

// Export a single instance of the service
export const geminiService = new GeminiService();
