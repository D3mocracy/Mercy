import DataBase from '../utils/db';

export class WhatsAppMongoStore {
    private sessionId: string;

    constructor(sessionId: string = 'default') {
        this.sessionId = sessionId;
    }

    async sessionExists(): Promise<boolean> {
        try {
            const session = await DataBase.whatsappSessionsCollection.findOne({ 
                sessionId: this.sessionId 
            });
            return !!session;
        } catch (error) {
            console.error('Error checking session existence:', error);
            return false;
        }
    }

    async save(sessionData: any): Promise<void> {
        try {
            await DataBase.whatsappSessionsCollection.replaceOne(
                { sessionId: this.sessionId },
                {
                    sessionId: this.sessionId,
                    data: sessionData,
                    updatedAt: new Date()
                },
                { upsert: true }
            );
            console.log('WhatsApp session saved to MongoDB');
        } catch (error) {
            console.error('Error saving WhatsApp session:', error);
            throw error;
        }
    }

    async extract(): Promise<any> {
        try {
            const session = await DataBase.whatsappSessionsCollection.findOne({ 
                sessionId: this.sessionId 
            });
            
            if (session && session.data) {
                console.log('WhatsApp session extracted from MongoDB');
                return session.data;
            }
            
            return null;
        } catch (error) {
            console.error('Error extracting WhatsApp session:', error);
            return null;
        }
    }

    async delete(): Promise<void> {
        try {
            await DataBase.whatsappSessionsCollection.deleteOne({ 
                sessionId: this.sessionId 
            });
            console.log('WhatsApp session deleted from MongoDB');
        } catch (error) {
            console.error('Error deleting WhatsApp session:', error);
            throw error;
        }
    }
}