import { Client, LocalAuth, Message, Buttons, List } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { WhatsAppMessageHandler } from '../handlers/WhatsAppMessageHandler';
import { ErrorHandler } from '../utils/ErrorHandler';

export class WhatsAppClient {
    private client: Client;
    private messageHandler: WhatsAppMessageHandler;
    private isReady: boolean = false;

    constructor() {
        this.client = new Client({
            authStrategy: new LocalAuth({
                clientId: "mercy-bot-whatsapp"
            }),
            puppeteer: {
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--single-process',
                    '--disable-gpu'
                ]
            }
        });

        this.messageHandler = new WhatsAppMessageHandler(this.client);
        this.setupEventHandlers();
    }

    private setupEventHandlers(): void {
        this.client.on('qr', (qr: string) => {
            console.log('📱 WhatsApp QR Code:');
            qrcode.generate(qr, { small: true });
            console.log('Scan this QR code with WhatsApp on phone number: +972529772722');
        });

        this.client.on('ready', () => {
            console.log('✅ WhatsApp Client is ready!');
            this.isReady = true;
        });

        this.client.on('authenticated', () => {
            console.log('✅ WhatsApp Client authenticated!');
        });

        this.client.on('auth_failure', (msg: string) => {
            console.error('❌ WhatsApp authentication failed:', msg);
        });

        this.client.on('disconnected', (reason: string) => {
            console.log('❌ WhatsApp Client disconnected:', reason);
            this.isReady = false;
        });

        this.client.on('message', async (message: Message) => {
            if (this.isReady && !message.fromMe) {
                try {
                    await this.messageHandler.handleIncomingMessage(message);
                } catch (error) {
                    await ErrorHandler.handleAsyncError(error, 'WhatsApp message handling');
                }
            }
        });
    }

    async initialize(): Promise<void> {
        try {
            console.log('🔄 Starting WhatsApp Client...');
            await this.client.initialize();
        } catch (error) {
            console.error('❌ Failed to initialize WhatsApp Client:', error);
            throw error;
        }
    }

    async sendMessage(to: string, message: string): Promise<void> {
        if (!this.isReady) {
            throw new Error('WhatsApp client is not ready');
        }

        try {
            // Format phone number for WhatsApp (remove + and add @c.us)
            const formattedNumber = to.replace('+', '') + '@c.us';
            await this.client.sendMessage(formattedNumber, message);
        } catch (error) {
            console.error('Failed to send WhatsApp message:', error);
            throw error;
        }
    }

    async sendButtons(to: string, buttons: Buttons): Promise<void> {
        if (!this.isReady) {
            throw new Error('WhatsApp client is not ready');
        }

        try {
            // Format phone number for WhatsApp (remove + and add @c.us)
            const formattedNumber = to.replace('+', '') + '@c.us';
            await this.client.sendMessage(formattedNumber, buttons);
        } catch (error) {
            console.error('Failed to send WhatsApp buttons:', error);
            throw error;
        }
    }

    async sendList(to: string, list: List): Promise<void> {
        if (!this.isReady) {
            throw new Error('WhatsApp client is not ready');
        }

        try {
            // Format phone number for WhatsApp (remove + and add @c.us)
            const formattedNumber = to.replace('+', '') + '@c.us';
            await this.client.sendMessage(formattedNumber, list);
        } catch (error) {
            console.error('Failed to send WhatsApp list:', error);
            throw error;
        }
    }

    getClient(): Client {
        return this.client;
    }

    isClientReady(): boolean {
        return this.isReady;
    }

    async destroy(): Promise<void> {
        if (this.client) {
            await this.client.destroy();
            this.isReady = false;
        }
    }
}

export default WhatsAppClient;