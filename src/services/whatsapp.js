import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from "qrcode-terminal";
import { messageHandler } from '../handlers/messageHandler.js';

class WhatsAppService {
    constructor() {
        this.client = new Client({
            authStrategy: new LocalAuth(),
            puppeteer: {
                args: ['--no-sandbox']
            }
        });

        this.initializeClient();
    }

    initializeClient() {
        this.client.on('qr', (qr) => {
            qrcode.generate(qr, { small: true });
            console.log('QR Code telah digenerate!');
        });

        this.client.on('ready', () => {
            console.log('WhatsApp client siap!');
        });

        this.client.on('message', messageHandler);

        this.client.initialize();
    }
}

export const whatsAppService = new WhatsAppService();