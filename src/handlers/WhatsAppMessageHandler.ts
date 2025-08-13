import { Client as DiscordClient, TextChannel, ChannelType } from 'discord.js';
import DataBase from '../utils/db';
import { Conversation } from '../utils/types';
import { Utils } from '../utils/Utils';
import ConfigHandler from './Config';
import { ConversationManageMessageUtils } from '../utils/MessageUtils/ConversationManage';
import CreateConversationHandler from './CreateConversation';
import WhatsAppUserFlow from './WhatsAppUserFlow';

export class WhatsAppMessageHandler {
    private discordClient?: DiscordClient;
    private userFlow: WhatsAppUserFlow;

    constructor() {
        this.userFlow = new WhatsAppUserFlow();
    }

    setDiscordClient(discordClient: DiscordClient): void {
        this.discordClient = discordClient;
    }

    async handleIncomingMessage(message: any): Promise<void> {
        if (!this.discordClient) {
            console.error('Discord client not set for WhatsApp handler');
            return;
        }

        try {
            // Extract phone number from wppconnect message format
            const phoneNumber = this.formatPhoneNumber(message.from.replace('@c.us', ''));
            const whatsappUserId = `whatsapp_${phoneNumber}`;

            // First, check if conversation already exists
            let conversation = await DataBase.conversationsCollection.findOne({
                userId: whatsappUserId,
                open: true
            }) as Conversation | null;

            if (conversation?.channelId) {
                // Check if user wants to close the conversation
                if (message.body.trim() === 'סיים שיחה') {
                    await this.handleUserCloseRequest(phoneNumber, conversation);
                    return;
                }
                
                // Check if user is confirming close
                if (message.body.trim() === 'כן' && await this.hasPendingCloseRequest(phoneNumber)) {
                    await this.closeConversationByUser(phoneNumber, conversation);
                    return;
                }
                
                // Check if user is canceling close
                if (message.body.trim() === 'לא' && await this.hasPendingCloseRequest(phoneNumber)) {
                    await this.cancelCloseRequest(phoneNumber);
                    return;
                }
                
                // Clear any pending close request when user sends other messages
                await this.clearPendingCloseRequest(phoneNumber);
                
                // Chat is already open, just forward the message
                await this.forwardToDiscord(conversation.channelId, message);
                return;
            }

            // Check if this is a button or list response (wppconnect format)
            let buttonId: string | undefined;
            if (message.selectedButtonId) {
                buttonId = message.selectedButtonId;
            } else if (message.selectedRowId) {
                buttonId = message.selectedRowId;
            }

            // No open conversation - handle user flow (terms, pronouns, topic selection)
            const flowResult = await this.userFlow.handleUserMessage(phoneNumber, message.body, buttonId);
            
            // Handle interactive message needs
            if (flowResult.needsInteractive) {
                await this.sendInteractiveMessage(phoneNumber, flowResult.needsInteractive);
                return;
            }
            
            if (flowResult.response) {
                // Send response to user (still in flow)
                await this.sendToWhatsApp(phoneNumber, flowResult.response);
                return;
            }

            if (!flowResult.shouldCreateChannel) {
                return;
            }

            // Check if this is a topic selection message
            const validTopics = ['משפחה', 'חברים', 'אהבה וזוגיות', 'יחסי מין', 'גוף ונפש', 'בריאות ותזונה', 'קריירה', 'צבא', 'לימודים', 'כסף', 'אחר'];
            
            // Map numbers to topics
            const topicMap: Record<string, string> = {
                '1': 'משפחה',
                '2': 'חברים',
                '3': 'אהבה וזוגיות',
                '4': 'יחסי מין',
                '5': 'גוף ונפש',
                '6': 'בריאות ותזונה',
                '7': 'קריירה',
                '8': 'צבא',
                '9': 'לימודים',
                '10': 'כסף',
                '11': 'אחר'
            };
            
            let selectedTopic = validTopics.find(topic => message.body.trim() === topic);
            
            // Note: buttonId handling removed since interactive messages aren't supported
            
            // Check if user sent a number
            if (!selectedTopic && topicMap[message.body.trim()]) {
                selectedTopic = topicMap[message.body.trim()];
            }
            
            if (selectedTopic) {
                // Create conversation with selected topic
                conversation = await this.createWhatsAppConversation(whatsappUserId, phoneNumber, selectedTopic);
                
                // Send confirmation message to user
                await this.sendToWhatsApp(phoneNumber, 'צוות המתנדבים קיבל את הודעתכם בהצלחה! כל הודעה שתשלחו כאן תגיע באופן אנונימי לצוות.\n\nניתן לסגור את הצ\'אט בכל עת על ידי כתיבת "סיים שיחה".');
                return;
            }

            // User completed flow but didn't select topic yet, prompt for topic
            if (flowResult.shouldCreateChannel && !selectedTopic) {
                await this.sendInteractiveMessage(phoneNumber, 'topics_list');
                return;
            }
        } catch (error) {
            console.error('Error handling WhatsApp message:', error);
        }
    }

    private async createWhatsAppConversation(userId: string, phoneNumber: string, topic?: string): Promise<Conversation> {
        // Get next conversation number (same as Discord conversations)
        const numberOfConversation = (await Utils.getNumberOfConversationFromDB()) + 1;

        // Use the existing CreateConversationHandler pattern
        const conversation: Conversation = {
            userId: userId,
            guildId: ConfigHandler.config.guild?.id || '',
            open: true,
            date: new Date(),
            subject: topic || 'WhatsApp Support', // Use selected topic or default
            source: 'whatsapp',
            whatsappNumber: phoneNumber,
            channelId: '',
            channelNumber: numberOfConversation
        };

        // Create Discord channel
        const channel = await this.createDiscordChannel(phoneNumber);
        conversation.channelId = channel.id;

        // Save to database
        const result = await DataBase.conversationsCollection.insertOne(conversation);
        conversation._id = result.insertedId;

        // Send initial messages to the channel
        await this.sendInitialChannelMessages(channel, numberOfConversation, topic, phoneNumber);

        return conversation;
    }

    private async createDiscordChannel(phoneNumber: string): Promise<TextChannel> {
        const guild = ConfigHandler.config.guild;
        const category = ConfigHandler.config.conversationCatagory;

        if (!guild || !category) {
            throw new Error('Guild or category not configured');
        }

        // Get next conversation number (same as Discord conversations)
        const numberOfConversation = (await Utils.getNumberOfConversationFromDB()) + 1;
        
        const channel = await guild.channels.create({
            name: `צ'אט ${numberOfConversation}`,
            type: ChannelType.GuildText,
            parent: category,
            topic: `WhatsApp conversation - Anonymous`
        });

        return channel;
    }

    private async sendInitialChannelMessages(channel: TextChannel, numberOfConversation: number, topic?: string, phoneNumber?: string): Promise<void> {
        // Get user pronouns
        let pronounsText = '';
        if (phoneNumber) {
            const pronouns = await this.userFlow.getUserPronouns(phoneNumber);
            if (pronouns) {
                pronounsText = `לשון פנייה מועדפת: ${pronouns}`;
            }
        }

        const description = `משתמש פתח צ'אט דרך וואטסאפ בנושא ${topic || 'לא צוין'}, נא להעניק סיוע בהתאם!
        ${pronounsText}`;

        const embed = {
            title: `צ'אט ${numberOfConversation} - וואטסאפ 📱`,
            description: description,
            fields: [
                { name: 'נושא', value: topic || 'לא צוין', inline: true }
            ],
            color: 0x25D366, // WhatsApp green
            timestamp: new Date().toISOString()
        };

        await channel.send({ 
            content: `<@&${ConfigHandler.config.memberRole?.id}>`,
            embeds: [embed],
            components: [ConversationManageMessageUtils.Actions.supporterTools]
        }).then((message) => message.edit({ content: null }));
    }

    private async forwardToDiscord(channelId: string, message: any): Promise<void> {
        const channel = Utils.getChannelById(this.discordClient!, channelId) as TextChannel;
        
        if (!channel) {
            console.error(`Discord channel ${channelId} not found`);
            return;
        }

        let messageContent = message.body || message.text || '';

        // Handle media messages (wppconnect format)
        if (message.type !== 'chat') {
            messageContent += `\n📎 Media: ${message.type}`;
            
            // For images, we could potentially upload them to Discord
            if (message.type === 'image') {
                messageContent += '\n*[Image content - media handling not implemented yet]*';
            } else if (message.type === 'document') {
                messageContent += '\n*[Document content]*';
            } else if (message.type === 'audio') {
                messageContent += '\n*[Audio content]*';
            }
        }

        await channel.send(messageContent);
    }

    private whatsappClient: any = null;

    setWhatsAppClient(client: any): void {
        this.whatsappClient = client;
    }

    async sendToWhatsApp(phoneNumber: string, message: string): Promise<void> {
        if (!this.whatsappClient) {
            console.error('WhatsApp client not set for message handler');
            return;
        }

        try {
            await this.whatsappClient.sendMessage(phoneNumber, message);
        } catch (error) {
            console.error('Failed to send message to WhatsApp:', error);
            throw error;
        }
    }

    private formatPhoneNumber(number: string): string {
    // Remove all non-digit characters
    const cleaned = number.replace(/\D/g, '');

    // If it starts with a country code (like 1, 44, 358, 972...), just return it
    if (!cleaned.startsWith('0')) {
        return cleaned;
    }

    // Otherwise, assume it's a local Israeli number starting with 0
    return '972' + cleaned.substring(1);
}


    private async getTopicPrompt(): Promise<string> {
        return `אנא בחרו את נושא הפנייה:
1. משפחה
2. חברים
3. אהבה וזוגיות
4. יחסי מין
5. גוף ונפש
6. בריאות ותזונה
7. קריירה
8. צבא
9. לימודים
10. כסף
11. אחר`;
    }

    private async sendInteractiveMessage(phoneNumber: string, type: 'buttons' | 'pronouns_list' | 'topics_list'): Promise<void> {
        try {
            let message: string;
            
            switch (type) {
                case 'buttons':
                    message = await this.getTermsMessage();
                    await this.sendToWhatsApp(phoneNumber, message);
                    // Send the second message immediately after
                    await this.sendToWhatsApp(phoneNumber, 'כתבו: "מאשר" או "לא מאשר".');
                    return;
                    
                case 'pronouns_list':
                    await this.sendToWhatsApp(phoneNumber, 'תודה על הסכמתכם לתנאי השימוש!\n\nאיך תרצו שנפנה אליכם?\n1. את - לשון נקבה\n2. אתה - לשון זכר\n3. אתם - לשון רבים\n4. לא משנה לי - ללא העדפה');
                    await this.sendToWhatsApp(phoneNumber, 'השיבו עם המספר (1-4) או הטקסט המלא.');
                    return;
                    
                case 'topics_list':
                    message = await this.getTopicPrompt();
                    await this.sendToWhatsApp(phoneNumber, message);
                    // Send the second message immediately after
                    await this.sendToWhatsApp(phoneNumber, 'השיבו עם המספר (1-11) או שם הנושא.');
                    return;
                    
                default:
                    throw new Error(`Unknown interactive message type: ${type}`);
            }
            
            await this.sendToWhatsApp(phoneNumber, message);
        } catch (error) {
            console.error(`Failed to send interactive message (${type}):`, error);
            throw error;
        }
    }

    private async getTermsMessage(): Promise<string> {
        return `לפני שמתחילים, חשוב שתקראו ותאשרו את תנאי השימוש:
1. השימוש בבוט הוא לא תחלופה לעזרה מקצועית.
2. הצוות מורשה לסגור צ'אטים בכל עת, ואף להשעות משתמשים משימוש בבוט לפי שיקול דעתו.
3. במקרים חריגים מאוד הנהלת השרת תעביר מידע ושיחות לגורמים חיצוניים.
4. הבוט נועד לספק תמיכה בלבד. אין להשתמש בו לשיחות חולין, בדיחות או ניהול שיחות לא רציניות עם הצוות.
5. לשמירה על בטיחותכם, אין לשתף פרטים מזהים כמו שם מלא, כתובת, מספר טלפון, או כל פרט אישי אחר בצ'אטים.
6. לא מובטח מענה להודעות בכל שעות היממה.`;
    }


    async banPhoneNumber(phoneNumber: string, reason: string): Promise<void> {
        await this.userFlow.banUser(phoneNumber, reason);
    }

    async unbanPhoneNumber(phoneNumber: string): Promise<void> {
        await this.userFlow.unbanUser(phoneNumber);
    }

    private async handleUserCloseRequest(phoneNumber: string, conversation: Conversation): Promise<void> {
        // Store pending close request
        await this.setPendingCloseRequest(phoneNumber);
        
        // Send confirmation message
        await this.sendToWhatsApp(phoneNumber, 
            `אתם בטוחים שברצונכם לסגור את הצ'אט?\n\n✅ כן - לסגירת הצ'אט\n❌ לא - להמשיך בצ'אט\n\nהשיבו "כן" או "לא"`
        );
    }

    private async closeConversationByUser(phoneNumber: string, conversation: Conversation): Promise<void> {
        try {
            // Clear pending close request
            await this.clearPendingCloseRequest(phoneNumber);
            
            // Close the conversation in the database
            conversation.open = false;
            const { _id, ...updateData } = conversation;
            await DataBase.conversationsCollection.updateOne(
                { channelId: conversation.channelId }, 
                { $set: updateData }
            );
            
            // Send closure message to Discord channel
            const channel = Utils.getChannelById(this.discordClient!, conversation.channelId) as TextChannel;
            if (channel) {
                const closedMessage = {
                    embeds: [ConversationManageMessageUtils.EmbedMessages.chatClosed("המשתמש", channel.name)]
                };
                await channel.send(closedMessage);
                
                // Delete the channel after a short delay
                setTimeout(async () => {
                    try {
                        await channel.delete();
                    } catch (error) {
                        console.error('Error deleting channel:', error);
                    }
                }, 5000);
            }
            
            // Send confirmation to user
            await this.sendToWhatsApp(phoneNumber, 
                'הצ\'אט נסגר בהצלחה. תודה שפניתם אלינו! ניתן לפתוח צ\'אט חדש בכל עת.'
            );
            
        } catch (error) {
            console.error('Error closing conversation by user:', error);
            await this.sendToWhatsApp(phoneNumber, 'אירעה שגיאה בסגירת הצ\'אט. אנא נסו שוב מאוחר יותר.');
        }
    }

    private async cancelCloseRequest(phoneNumber: string): Promise<void> {
        await this.clearPendingCloseRequest(phoneNumber);
        await this.sendToWhatsApp(phoneNumber, 'הפעולה בוטלה. הצ\'אט נשאר פתוח.');
    }

    private async setPendingCloseRequest(phoneNumber: string): Promise<void> {
        // Store in WhatsApp users collection with a timestamp
        await DataBase.whatsappUsersCollection.updateOne(
            { phoneNumber },
            { 
                $set: { 
                    pendingCloseRequest: true,
                    pendingCloseTimestamp: new Date(),
                    updatedAt: new Date()
                }
            },
            { upsert: true }
        );
    }

    private async hasPendingCloseRequest(phoneNumber: string): Promise<boolean> {
        const user = await DataBase.whatsappUsersCollection.findOne({ phoneNumber });
        
        if (!user?.pendingCloseRequest) {
            return false;
        }
        
        // Check if the request is still valid (within 5 minutes)
        const now = new Date();
        const requestTime = new Date(user.pendingCloseTimestamp || 0);
        const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
        
        if (requestTime < fiveMinutesAgo) {
            // Clear expired request
            await this.clearPendingCloseRequest(phoneNumber);
            return false;
        }
        
        return true;
    }

    private async clearPendingCloseRequest(phoneNumber: string): Promise<void> {
        await DataBase.whatsappUsersCollection.updateOne(
            { phoneNumber },
            { 
                $unset: { 
                    pendingCloseRequest: "",
                    pendingCloseTimestamp: ""
                },
                $set: {
                    updatedAt: new Date()
                }
            }
        );
    }
}

export default WhatsAppMessageHandler;