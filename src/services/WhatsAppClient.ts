import * as wppconnect from '@wppconnect-team/wppconnect';
import { WhatsAppMessageHandler } from '../handlers/WhatsAppMessageHandler';
import { ErrorHandler } from '../utils/ErrorHandler';

export class WhatsAppClient {
    private client: wppconnect.Whatsapp | null = null;
    private messageHandler: WhatsAppMessageHandler;
    private isReady: boolean = false;

    constructor() {
        this.messageHandler = new WhatsAppMessageHandler();
    }

    private setupEventHandlers(): void {
        if (!this.client) return;

        this.client.onMessage(async (message: any) => {
            console.log('📨 Received WhatsApp message:', {
                from: message.from,
                type: message.type,
                isGroupMsg: message.isGroupMsg,
                fromMe: message.fromMe,
                isReady: this.isReady,
                body: message.body?.substring(0, 50)
            });

            if (this.isReady && !message.isGroupMsg && !message.fromMe && message.type === 'chat') {
                try {
                    console.log('✅ Processing message...');
                    await this.messageHandler.handleIncomingMessage(message);
                } catch (error) {
                    await ErrorHandler.handleAsyncError(error, 'WhatsApp message handling');
                }
            } else {
                console.log('❌ Message filtered out - isReady:', this.isReady, 'isGroupMsg:', message.isGroupMsg, 'fromMe:', message.fromMe, 'type:', message.type);
            }
        });

        this.client.onStateChange((state: string) => {
            console.log('📱 WhatsApp State changed:', state);
            // wppconnect states: CONFLICT, CONNECTED, DEPRECATED_VERSION, OPENING, PAIRING, PROXYBLOCK, SMB_TOS_BLOCK, TIMEOUT, TOS_BLOCK, UNLAUNCHED, UNPAIRED, UNPAIRED_IDLE
            // Also check for inChat status which indicates ready state
            if (state === 'CONNECTED' || state.includes('MAIN') || state === 'inChat') {
                console.log('✅ WhatsApp Client is ready!');
                this.isReady = true;
            } else if (state === 'DISCONNECTED' || state === 'CONFLICT') {
                console.log('❌ WhatsApp Client disconnected');
                this.isReady = false;
            }
        });
    }

    async initialize(): Promise<void> {
        try {
            console.log('🔄 Starting WhatsApp Client...');
            this.client = await wppconnect.create({
                session: 'mercy-bot',
                catchQR: (base64Qrimg: string, asciiQR: string) => {
                    console.log('📱 WhatsApp QR Code:');
                    console.log('RAW QR CODE TEXT:');
                    console.log(asciiQR);
                    console.log('Copy the text above and paste it into: https://qr-code-generator.com');
                    console.log('Then scan the generated QR with WhatsApp on phone number: +972529772722');
                },
                statusFind: (statusSession: string, session: string) => {
                    console.log('📱 Status Session:', statusSession);
                },
                headless: true,
                devtools: false,
                useChrome: true,
                debug: false,
                logQR: true,
                puppeteerOptions: {
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

            this.setupEventHandlers();

            // Set as ready since we've successfully initialized
            // The state is already MAIN (NORMAL) by the time we register handlers
            this.isReady = true;
            console.log('✅ WhatsApp Client initialized successfully! isReady:', this.isReady);
        } catch (error) {
            console.error('❌ Failed to initialize WhatsApp Client:', error);
            throw error;
        }
    }

    async sendMessage(to: string, message: string): Promise<void> {
        if (!this.isReady || !this.client) {
            throw new Error('WhatsApp client is not ready');
        }

        try {
            // Format phone number for WhatsApp (remove + and add @c.us)
            const formattedNumber = to.replace('+', '') + '@c.us';
            await this.client.sendText(formattedNumber, message);
        } catch (error) {
            console.error('Failed to send WhatsApp message:', error);
            throw error;
        }
    }

    async sendButtons(to: string, text: string, buttons: Array<{buttonText: {displayText: string}, buttonId: string, type: number}>): Promise<void> {
        if (!this.isReady || !this.client) {
            throw new Error('WhatsApp client is not ready');
        }

        try {
            // Format phone number for WhatsApp (remove + and add @c.us)
            const formattedNumber = to.replace('+', '') + '@c.us';
            // Use sendText for now since sendButtons API might be different
            await this.client.sendText(formattedNumber, text);
        } catch (error) {
            console.error('Failed to send WhatsApp buttons:', error);
            throw error;
        }
    }

    async sendList(to: string, text: string, buttonText: string, sections: Array<{title: string, rows: Array<{title: string, description: string, rowId: string}>}>): Promise<void> {
        if (!this.isReady || !this.client) {
            throw new Error('WhatsApp client is not ready');
        }

        try {
            // Format phone number for WhatsApp (remove + and add @c.us)
            const formattedNumber = to.replace('+', '') + '@c.us';
            // Use sendText for now since sendListMessage API might be different
            await this.client.sendText(formattedNumber, text);
        } catch (error) {
            console.error('Failed to send WhatsApp list:', error);
            throw error;
        }
    }

    getClient(): wppconnect.Whatsapp | null {
        return this.client;
    }

    isClientReady(): boolean {
        return this.isReady && this.client !== null;
    }

    async destroy(): Promise<void> {
        if (this.client) {
            await this.client.close();
            this.isReady = false;
            this.client = null;
        }
    }
}

export default WhatsAppClient;