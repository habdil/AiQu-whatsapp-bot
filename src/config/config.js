// src/config/config.js
import dotenv from 'dotenv';
dotenv.config();

export const config = {
    geminiApiKey: process.env.GEMINI_API_KEY,
    prefix: 'hii',
    maxResponseLength: 1000,
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['*']
};