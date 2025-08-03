import { WhatsAppUser } from '../utils/types';
import DataBase from '../utils/db';

export class WhatsAppUserFlow {
    constructor() {}

    async handleUserMessage(phoneNumber: string, messageText: string, buttonId?: string): Promise<{ shouldCreateChannel: boolean, response?: string, needsInteractive?: 'buttons' | 'pronouns_list' | 'topics_list' }> {
        let user = await DataBase.whatsappUsersCollection.findOne({ phoneNumber });
        
        // Check if user is banned
        if (user?.isBanned) {
            return {
                shouldCreateChannel: false,
                response: `אתם חסומים מהשירות. סיבה: ${user.bannedReason || 'לא צוין'}`
            };
        }

        // Check for Discord-based punishments (timeout/ban)
        const whatsappUserId = `whatsapp_${phoneNumber}`;
        const activePunishments = await this.checkActivePunishments(whatsappUserId);
        
        if (activePunishments.isBanned) {
            return {
                shouldCreateChannel: false,
                response: `אתם חסומים מהשירות. סיבה: ${activePunishments.reason}`
            };
        }
        
        if (activePunishments.isMuted) {
            const timeLeft = activePunishments.muteExpiry ? Math.ceil((activePunishments.muteExpiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0;
            return {
                shouldCreateChannel: false,
                response: `אתם מושתקים מפתיחת צ'אטים חדשים. סיבה: ${activePunishments.reason}\nזמן נותר: ${timeLeft > 0 ? `${timeLeft} ימים` : 'פחות מיום'}`
            };
        }

        // If user doesn't exist, create new user and start terms flow
        if (!user) {
            await this.createNewUser(phoneNumber);
            return {
                shouldCreateChannel: false,
                needsInteractive: 'buttons'
            };
        }

        // If user hasn't accepted terms, handle terms response
        if (!user.hasAcceptedTerms) {
            return await this.handleTermsResponse(phoneNumber, messageText, buttonId);
        }

        // If user doesn't have pronouns set, handle pronouns selection
        if (!user.pronouns) {
            return await this.handlePronounsResponse(phoneNumber, messageText, buttonId);
        }

        // User is ready for topic selection and channel creation
        return { shouldCreateChannel: true };
    }

    private async createNewUser(phoneNumber: string): Promise<WhatsAppUser> {
        const user: Omit<WhatsAppUser, '_id'> = {
            phoneNumber,
            hasAcceptedTerms: false,
            isBanned: false,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await DataBase.whatsappUsersCollection.insertOne(user as WhatsAppUser);
        return { ...user, _id: result.insertedId };
    }

    private async getTermsMessage(): Promise<string> {
        return `ברוכים הבאים לשירות התמיכה שלנו! 📱

לפני שנתחיל, אנחנו חייבים לקבל את הסכמתכם לתנאי השימוש:

השימוש בבוט הוא לא תחלופה לעזרה מקצועית.
הנהלת השרת מורשית לסגור צ'אטים בכל עת, ואף להשעות משתמשים משימוש בבוט ו/או מהשרת לפי שיקול דעתה.
במקרים חריגים מאוד הנהלת השרת תעביר מידע ושיחות לגורמים חיצוניים.
הבוט נועד לספק תמיכה בלבד. אין להשתמש בו לשיחות חולין, בדיחות או ניהול שיחות לא רציניות עם הצוות.
לשמירה על בטיחותכם, אין לשתף פרטים מזהים כמו שם מלא, כתובת, מספר טלפון, או כל פרט אישי אחר בצ'אטים.
לא מובטח מענה להודעות בכל שעות היממה.

אנא בחרו מהאפשרויות הבאות:

1️⃣ מאשר - להסכמה לתנאים
2️⃣ לא מאשר - לביטול השירות

השיבו עם המספר (1 או 2) או הטקסט המלא.`;
    }

    private async handleTermsResponse(phoneNumber: string, messageText: string, buttonId?: string): Promise<{ shouldCreateChannel: boolean, response?: string, needsInteractive?: 'buttons' | 'pronouns_list' | 'topics_list' }> {
        // Handle button response
        if (buttonId === 'terms_accept') {
            await DataBase.whatsappUsersCollection.updateOne(
                { phoneNumber },
                { 
                    $set: { 
                        hasAcceptedTerms: true,
                        updatedAt: new Date()
                    }
                }
            );
            
            return {
                shouldCreateChannel: false,
                needsInteractive: 'pronouns_list'
            };
        } else if (buttonId === 'terms_decline') {
            return {
                shouldCreateChannel: false,
                response: 'לא ניתן להמשיך בלי לאשר את תנאי השימוש. אם תרצו לדבר איתנו או לקבל תמיכה, נא אשרו את התנאים ונשמח לעזור לכם כאן או בשרת הדיסקורד שלנו.'
            };
        } else {
            // Fallback for text responses  
            const normalizedText = messageText.trim().toLowerCase();
            if (normalizedText === 'מאשר' || normalizedText === '1') {
                await DataBase.whatsappUsersCollection.updateOne(
                    { phoneNumber },
                    { 
                        $set: { 
                            hasAcceptedTerms: true,
                            updatedAt: new Date()
                        }
                    }
                );
                
                return {
                    shouldCreateChannel: false,
                    needsInteractive: 'pronouns_list'
                };
            } else if (normalizedText === 'לא מאשר' || normalizedText === '2') {
                return {
                    shouldCreateChannel: false,
                    response: 'לא ניתן להמשיך בלי לאשר את תנאי השימוש. אם תרצו לדבר איתנו או לקבל תמיכה, נא אשרו את התנאים ונשמח לעזור לכם כאן או בשרת הדיסקורד שלנו.'
                };
            } else {
                return {
                    shouldCreateChannel: false,
                    response: 'אנא השיבו "1" (מאשר) או "2" (לא מאשר) בלבד או השתמשו בכפתורים.'
                };
            }
        }
    }

    private async getPronounsMessage(): Promise<string> {
        return `תודה על הסכמתכם לתנאי השימוש! 

איך תרצו שנפנה אליכם?

1️⃣ את - לשון נקבה
2️⃣ אתה - לשון זכר  
3️⃣ אתם - לשון רבים
4️⃣ לא משנה לי - ללא העדפה

השיבו עם המספר (1-4) או הטקסט המלא.`;
    }

    private async handlePronounsResponse(phoneNumber: string, messageText: string, buttonId?: string): Promise<{ shouldCreateChannel: boolean, response?: string, needsInteractive?: 'buttons' | 'pronouns_list' | 'topics_list' }> {
        const normalizedText = messageText.trim();
        const validPronouns: Array<'את' | 'אתה' | 'אתם' | 'לא משנה לי'> = ['את', 'אתה', 'אתם', 'לא משנה לי'];
        
        // Map numbers to pronouns
        const pronounMap: Record<string, 'את' | 'אתה' | 'אתם' | 'לא משנה לי'> = {
            '1': 'את',
            '2': 'אתה',
            '3': 'אתם',
            '4': 'לא משנה לי'
        };
        
        let selectedPronoun: 'את' | 'אתה' | 'אתם' | 'לא משנה לי' | undefined;
        
        // Handle text response (interactive buttons not supported on WhatsApp Web)
        {
            // Handle text response
            if (pronounMap[normalizedText]) {
                selectedPronoun = pronounMap[normalizedText];
            } else if (validPronouns.includes(normalizedText as any)) {
                selectedPronoun = normalizedText as 'את' | 'אתה' | 'אתם' | 'לא משנה לי';
            }
        }
        
        if (selectedPronoun) {
            await DataBase.whatsappUsersCollection.updateOne(
                { phoneNumber },
                { 
                    $set: { 
                        pronouns: selectedPronoun,
                        updatedAt: new Date()
                    }
                }
            );
            
            return {
                shouldCreateChannel: false,
                needsInteractive: 'topics_list'
            };
        } else {
            return {
                shouldCreateChannel: false,
                response: 'אנא השיבו עם מספר (1-4) או הטקסט המלא: "את", "אתה", "אתם", או "לא משנה לי"'
            };
        }
    }

    private async getTopicSelectionMessage(): Promise<string> {
        return `תודה! כעת אנא בחרו את נושא הפנייה:

1️⃣ משפחה - נושאים הקשורים למשפחה
2️⃣ חברים - יחסים חברתיים וחברויות
3️⃣ אהבה וזוגיות - יחסים רומנטיים
4️⃣ יחסי מין - נושאים אינטימיים
5️⃣ גוף ונפש - בריאות נפשית ופיזית
6️⃣ בריאות ותזונה - נושאי בריאות כלליים
7️⃣ קריירה - עבודה ופיתוח מקצועי
8️⃣ צבא - שירות צבאי
9️⃣ לימודים - חינוך והשכלה
🔟 כסף - נושאים כלכליים
1️⃣1️⃣ אחר - נושאים אחרים

השיבו עם המספר (1-11) או שם הנושא:`;
    }

    async getUserPronouns(phoneNumber: string): Promise<string | undefined> {
        const user = await DataBase.whatsappUsersCollection.findOne({ phoneNumber });
        return user?.pronouns;
    }

    async banUser(phoneNumber: string, reason: string): Promise<void> {
        await DataBase.whatsappUsersCollection.updateOne(
            { phoneNumber },
            { 
                $set: { 
                    isBanned: true,
                    bannedReason: reason,
                    bannedDate: new Date(),
                    updatedAt: new Date()
                }
            },
            { upsert: true }
        );
    }

    async unbanUser(phoneNumber: string): Promise<void> {
        await DataBase.whatsappUsersCollection.updateOne(
            { phoneNumber },
            { 
                $set: { 
                    isBanned: false,
                    bannedReason: undefined,
                    bannedDate: undefined,
                    updatedAt: new Date()
                }
            }
        );
    }

    private async checkActivePunishments(userId: string): Promise<{ isBanned: boolean, isMuted: boolean, reason?: string, muteExpiry?: Date }> {
        try {
            // Find the most recent punishment for this user
            const latestPunishment = await DataBase.punishmentsCollection.findOne(
                { userId },
                { sort: { punishDate: -1 } }
            );

            if (!latestPunishment) {
                return { isBanned: false, isMuted: false };
            }

            // Check for ban
            if (latestPunishment.punishType === 'ban') {
                return {
                    isBanned: true,
                    isMuted: false,
                    reason: latestPunishment.reason
                };
            }

            // Check for active timeout/mute
            if (latestPunishment.punishType === 'timeout') {
                const punishment = latestPunishment as any;
                const now = new Date();
                const punishDate = new Date(latestPunishment.punishDate);
                
                // Use the actual timeout duration stored in the punishment record
                // If not available (for old records), fall back to 27 days
                const timeoutDays = punishment.timeoutDays || 27;
                const expiryDate = new Date(punishDate.getTime() + (timeoutDays * 24 * 60 * 60 * 1000));
                
                if (now < expiryDate) {
                    return {
                        isBanned: false,
                        isMuted: true,
                        reason: latestPunishment.reason,
                        muteExpiry: expiryDate
                    };
                }
            }

            return { isBanned: false, isMuted: false };
        } catch (error) {
            console.error('Error checking punishments:', error);
            return { isBanned: false, isMuted: false };
        }
    }
}

export default WhatsAppUserFlow;