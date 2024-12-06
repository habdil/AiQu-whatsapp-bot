import { config } from '../config/config.js';
import { geminiService } from '../services/gemini.js';

export async function messageHandler(message) {
    if (message.body.startsWith(config.prefix)) {
        const question = message.body.slice(config.prefix.length).trim();
        
        try {
            const response = await geminiService.generateResponse(question);
            await message.reply(response);
        } catch (error) {
            console.error('Error handling message:', error);
            await message.reply('Maaf, terjadi kesalahan saat memproses permintaan Anda.');
        }
    }
}