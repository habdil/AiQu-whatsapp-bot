import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcodeTerminal from "qrcode-terminal";
import qrcode from "qrcode";
import { messageHandler } from '../handlers/messageHandler.js';

class WhatsAppService {
    constructor() {
        this.client = new Client({
            authStrategy: new LocalAuth(),
            puppeteer: {
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--disable-gpu'
                ]
            }
        });
        this.ready = false;
        this.qr = null;
        this.io = null;
        this.initializeClient();
    }

    setSocketIO(io) {
        this.io = io;
    }

    isReady() {
        return this.ready;
    }

    async initializeClient() {
        this.client.on('qr', async (qr) => {
            // Generate QR for terminal
            qrcodeTerminal.generate(qr, { small: true });
            console.log('QR Code telah digenerate! Silakan scan menggunakan WhatsApp anda.');

            // Generate QR for web if socket is available
            try {
                this.qr = await qrcode.toDataURL(qr);
                if (this.io) {
                    this.io.emit('qr', this.qr);
                }
            } catch (err) {
                console.error('Error generating QR code for web:', err);
            }
        });

        this.client.on('ready', () => {
            this.ready = true;
            if (this.io) {
                this.io.emit('ready');
            }
            console.log('WhatsApp client siap!');
        });

        this.client.on('message', messageHandler);
        
        try {
            await this.client.initialize();
        } catch (error) {
            console.error('Error initializing WhatsApp client:', error);
        }
    }

    getQR() {
        return this.qr;
    }
}

export const whatsAppService = new WhatsAppService();