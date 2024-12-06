import dotenv from 'dotenv';
dotenv.config();

export const config = {
    geminiApiKey: process.env.GEMINI_API_KEY,
    prefix: 'hii',  // Prefix untuk command bot
    maxResponseLength: 1000  // Maximum panjang respons
};