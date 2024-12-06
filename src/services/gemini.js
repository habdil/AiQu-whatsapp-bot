import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from '../config/config.js';

class GeminiService {
    constructor() {
        this.genAI = new GoogleGenerativeAI(config.geminiApiKey);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
    }

    async generateResponse(prompt) {
        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Error generating response:', error);
            throw error;
        }
    }
}

export const geminiService = new GeminiService();