import { WhatsAppUser } from '../utils/types';
import DataBase from '../utils/db';

export class WhatsAppUserFlow {
    constructor() { }

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

        // Check if terms were just sent, now ask for confirmation
        if (user?.termsStep === 'sent') {
            await DataBase.whatsappUsersCollection.updateOne(
                { phoneNumber },
                {
                    $set: {
                        termsStep: 'waiting_for_response',
                        updatedAt: new Date()
                    }
                }
            );
            return {
                shouldCreateChannel: false,
                response: 'כתבו: "מאשר" או "לא מאשר".'
            };
        }

        // If user hasn't accepted terms, handle terms response
        if (!user.hasAcceptedTerms || user.termsStep === 'waiting_for_response') {
            return await this.handleTermsResponse(phoneNumber, messageText, buttonId);
        }

        // If user accepted terms but needs pronouns prompt
        if (user.hasAcceptedTerms && user.termsStep === 'accepted' && !user.pronounsStep) {
            await DataBase.whatsappUsersCollection.updateOne(
                { phoneNumber },
                {
                    $set: {
                        pronounsStep: 'sent',
                        updatedAt: new Date()
                    }
                }
            );
            return {
                shouldCreateChannel: false,
                response: 'תודה על הסכמתכם לתנאי השימוש!\n\nאיך תרצו שנפנה אליכם?\n1. את - לשון נקבה\n2. אתה - לשון זכר\n3. אתם - לשון רבים\n4. לא משנה לי - ללא העדפה'
            };
        }

        // If pronouns prompt was sent, ask for response
        if (user?.pronounsStep === 'sent') {
            await DataBase.whatsappUsersCollection.updateOne(
                { phoneNumber },
                {
                    $set: {
                        pronounsStep: 'waiting_for_response',
                        updatedAt: new Date()
                    }
                }
            );
            return {
                shouldCreateChannel: false,
                response: 'השיבו עם המספר (1-4) או הטקסט המלא.'
            };
        }

        // If user doesn't have pronouns set, handle pronouns selection
        if (!user.pronouns || user.pronounsStep === 'waiting_for_response') {
            return await this.handlePronounsResponse(phoneNumber, messageText, buttonId);
        }

        // User is ready for topic selection and channel creation
        return { shouldCreateChannel: true };
    }

    private async createNewUser(phoneNumber: string): Promise<WhatsAppUser> {
        const user: Omit<WhatsAppUser, '_id'> = {
            phoneNumber,
            hasAcceptedTerms: false,
            termsStep: 'sent',
            isBanned: false,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await DataBase.whatsappUsersCollection.insertOne(user as WhatsAppUser);
        return { ...user, _id: result.insertedId };
    }

    private async handleTermsResponse(phoneNumber: string, messageText: string, buttonId?: string): Promise<{ shouldCreateChannel: boolean, response?: string, needsInteractive?: 'buttons' | 'pronouns_list' | 'topics_list' }> {
        // Handle button response
        if (buttonId === 'terms_accept') {
            await DataBase.whatsappUsersCollection.updateOne(
                { phoneNumber },
                {
                    $set: {
                        hasAcceptedTerms: true,
                        termsStep: 'accepted',
                        pronounsStep: 'waiting_for_response',
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
                response: `לא ניתן להמשיך בלי לאשר את תנאי השימוש. אם תרצו לדבר איתנו או לקבל תמיכה, נא אשרו את התנאים ונשמח לעזור לכם כאן או בשרת הדיסקורד שלנו:
https://discord.gg/notalone`
            };
        } else {
            // Fallback for text responses  
            const normalizedText = messageText.trim().toLowerCase();
            if (normalizedText === 'מאשר') {
                await DataBase.whatsappUsersCollection.updateOne(
                    { phoneNumber },
                    {
                        $set: {
                            hasAcceptedTerms: true,
                            termsStep: 'accepted',
                            pronounsStep: 'waiting_for_response',
                            updatedAt: new Date()
                        }
                    }
                );

                return {
                    shouldCreateChannel: false,
                    needsInteractive: 'pronouns_list'
                };
            } else if (normalizedText === 'לא מאשר') {
                return {
                    shouldCreateChannel: false,
                    response: `לא ניתן להמשיך בלי לאשר את תנאי השימוש. אם תרצו לדבר איתנו או לקבל תמיכה, נא אשרו את התנאים ונשמח לעזור לכם כאן או בשרת הדיסקורד שלנו:
https://discord.gg/notalone`
                };
            } else {
                return {
                    shouldCreateChannel: false,
                    response: 'כתבו: "מאשר" או "לא מאשר".'
                };
            }
        }
    }

    private async handlePronounsResponse(phoneNumber: string, messageText: string, buttonId?: string): Promise<{ shouldCreateChannel: boolean, response?: string, needsInteractive?: 'buttons' | 'pronouns_list' | 'topics_list' }> {
        const user = await DataBase.whatsappUsersCollection.findOne({ phoneNumber });
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
                        pronounsStep: 'completed',
                        topicsStep: 'sent',
                        updatedAt: new Date()
                    }
                }
            );

            return {
                shouldCreateChannel: false,
                response: 'אנא בחרו את נושא הפנייה:\n1. משפחה\n2. חברים\n3. אהבה וזוגיות\n4. יחסי מין\n5. גוף ונפש\n6. בריאות ותזונה\n7. קריירה\n8. צבא\n9. לימודים\n10. כסף\n11. אחר'
            };
        }

        // Check if topics prompt should be sent
        if (user?.topicsStep === 'sent') {
            await DataBase.whatsappUsersCollection.updateOne(
                { phoneNumber },
                {
                    $set: {
                        topicsStep: 'waiting_for_response',
                        updatedAt: new Date()
                    }
                }
            );
            return {
                shouldCreateChannel: false,
                response: 'השיבו עם המספר (1-11) או שם הנושא.'
            };
        }

        return {
            shouldCreateChannel: false,
            response: 'אנא השיבו עם מספר (1-4) או הטקסט המלא: "את", "אתה", "אתם", או "לא משנה לי"'
        };
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