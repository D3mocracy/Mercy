// Global WhatsApp client instance reference
let whatsappClientInstance: any = null;

export function setWhatsAppClient(client: any): void {
    whatsappClientInstance = client;
}

export function getWhatsAppClient(): any {
    return whatsappClientInstance;
}

export async function sendWhatsAppMessage(phoneNumber: string, message: string): Promise<void> {
    if (!whatsappClientInstance) {
        throw new Error('WhatsApp client not initialized');
    }

    try {
        // Use the WhatsAppClient wrapper's sendMessage method
        // The wrapper expects the phone number without @c.us and adds it internally
        const formattedNumber = formatPhoneNumber(phoneNumber);
        await whatsappClientInstance.sendMessage(formattedNumber, message);
    } catch (error) {
        console.error('Failed to send WhatsApp message:', error);
        throw error;
    }
}

function formatPhoneNumber(number: string): string {
    // Remove any non-digit characters and ensure it starts with country code
    const cleaned = number.replace(/\D/g, '');
    
    // If it starts with 0, replace with 972 (Israel country code)
    if (cleaned.startsWith('0')) {
        return '972' + cleaned.substring(1);
    }
    
    // If it doesn't start with 972, add it
    if (!cleaned.startsWith('972')) {
        return '972' + cleaned;
    }
    
    return cleaned;
}