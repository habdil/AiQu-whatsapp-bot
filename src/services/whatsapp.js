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
                headless: true,
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
    }

    setSocketIO(io) {
        this.io = io;
        console.log('Socket.IO has been set');
    }

    isReady() {
        return this.ready;
    }

    async initializeClient() {
        console.log('Initializing WhatsApp client...');
        
        this.client.on('qr', async (qr) => {
            console.log('QR Code received');
            qrcodeTerminal.generate(qr, { small: true });
            
            try {
                const qrDataURL = await qrcode.toDataURL(qr);
                if (this.io) {
                    console.log('Emitting QR code to frontend');
                    this.io.emit('qr', qrDataURL);
                } else {
                    console.log('Socket.IO not initialized yet');
                }
            } catch (err) {
                console.error('Error generating QR code:', err);
            }
        });

        this.client.on('ready', () => {
            console.log('WhatsApp client is ready!');
            this.ready = true;
            if (this.io) {
                this.io.emit('ready');
            }
        });

        this.client.on('message', messageHandler);

        try {
            await this.client.initialize();
            console.log('Client initialization started');
        } catch (error) {
            console.error('Error initializing WhatsApp client:', error);
            throw error;
        }
    }
}

export const whatsAppService = new WhatsAppService();