import { ChatInputCommandInteraction, EmbedBuilder, User } from "discord.js";
import { ObjectId } from "mongodb";
import DataBase from "../utils/db";
import { Utils } from "../utils/Utils";
import ConfigHandler from "./Config";
import { ErrorHandler } from "../utils/ErrorHandler";

export class PunishmentManager {
    constructor(private interaction: ChatInputCommandInteraction) {}

    async handleCommand(): Promise<void> {
        const subcommand = this.interaction.options.getSubcommand();

        // Check permissions - only managers can use this command
        if (!Utils.isAdministrator(this.interaction.user.id)) {
            await this.interaction.reply({
                content: "❌ אין לך הרשאות לבצע פעולה זו. רק מנהלים יכולים לנהל ענישות.",
                ephemeral: true
            });
            return;
        }

        try {
            switch (subcommand) {
                case 'list':
                    await this.listAllPunishments();
                    break;
                case 'user':
                    await this.listUserPunishments();
                    break;
                case 'remove':
                    await this.removePunishment();
                    break;
                case 'add':
                    await this.addPunishment();
                    break;
                default:
                    await this.interaction.reply({
                        content: "❌ פקודה לא מזוהה",
                        ephemeral: true
                    });
            }
        } catch (error) {
            await ErrorHandler.handleInteractionError(this.interaction, error);
        }
    }

    private async listAllPunishments(): Promise<void> {
        await this.interaction.deferReply({ ephemeral: true });

        try {
            const punishments = await DataBase.punishmentsCollection
                .find({})
                .sort({ punishDate: -1 })
                .limit(50)
                .toArray();

            if (punishments.length === 0) {
                await this.interaction.editReply({
                    content: "📋 לא נמצאו ענישות במערכת"
                });
                return;
            }

            const activePunishments = await this.getActivePunishments(punishments);
            const embed = this.createPunishmentListEmbed(activePunishments, "כל הענישות הפעילות");

            await this.interaction.editReply({ embeds: [embed] });
        } catch (error) {
            await this.interaction.editReply({
                content: "❌ שגיאה בטעינת הענישות"
            });
            throw error;
        }
    }

    private async listUserPunishments(): Promise<void> {
        const userId = this.interaction.options.getString("user_id", true);
        await this.interaction.deferReply({ ephemeral: true });

        try {
            // Handle both Discord users and WhatsApp users
            let searchUserId = userId;
            if (userId.match(/^(\+?972|0)\d{8,9}$/)) {
                // Phone number format - convert to WhatsApp user ID
                const cleanNumber = userId.replace(/\D/g, '');
                const formattedNumber = cleanNumber.startsWith('0') 
                    ? '972' + cleanNumber.substring(1) 
                    : cleanNumber.startsWith('972') 
                        ? cleanNumber 
                        : '972' + cleanNumber;
                searchUserId = `whatsapp_${formattedNumber}`;
            }

            const punishments = await DataBase.punishmentsCollection
                .find({ userId: searchUserId })
                .sort({ punishDate: -1 })
                .toArray();

            if (punishments.length === 0) {
                await this.interaction.editReply({
                    content: `📋 לא נמצאו ענישות עבור המשתמש: \`${userId}\``
                });
                return;
            }

            const embed = this.createPunishmentListEmbed(punishments, `ענישות עבור: ${userId}`);
            await this.interaction.editReply({ embeds: [embed] });
        } catch (error) {
            await this.interaction.editReply({
                content: "❌ שגיאה בחיפוש ענישות המשתמש"
            });
            throw error;
        }
    }

    private async removePunishment(): Promise<void> {
        const punishmentId = this.interaction.options.getString("punishment_id", true);
        await this.interaction.deferReply({ ephemeral: true });

        try {
            // Validate punishment ID format
            if (!ObjectId.isValid(punishmentId)) {
                await this.interaction.editReply({
                    content: "❌ מזהה ענישה לא תקין"
                });
                return;
            }

            const punishment = await DataBase.punishmentsCollection.findOne({
                _id: new ObjectId(punishmentId)
            });

            if (!punishment) {
                await this.interaction.editReply({
                    content: "❌ לא נמצאה ענישה עם המזהה הזה"
                });
                return;
            }

            // Remove the punishment
            await DataBase.punishmentsCollection.deleteOne({
                _id: new ObjectId(punishmentId)
            });

            // Create success embed
            const embed = new EmbedBuilder()
                .setTitle("✅ ענישה הוסרה בהצלחה")
                .setColor(0x00ff00)
                .addFields([
                    { name: "מזהה הענישה", value: punishmentId, inline: true },
                    { name: "סוג הענישה", value: punishment.punishType === 'ban' ? 'באן' : 'טיים אאוט', inline: true },
                    { name: "סיבה", value: punishment.reason || 'לא צוין', inline: false },
                    { name: "הוסר על ידי", value: `${this.interaction.user}`, inline: true }
                ])
                .setTimestamp();

            await this.interaction.editReply({ embeds: [embed] });

            // Log the removal
            await this.logPunishmentRemoval(punishment, this.interaction.user);

        } catch (error) {
            await this.interaction.editReply({
                content: "❌ שגיאה בהסרת הענישה"
            });
            throw error;
        }
    }

    private async addPunishment(): Promise<void> {
        const userId = this.interaction.options.getString("user_id", true);
        const type = this.interaction.options.getString("type", true) as 'timeout' | 'ban';
        const reason = this.interaction.options.getString("reason", true);
        const days = this.interaction.options.getInteger("days");

        await this.interaction.deferReply({ ephemeral: true });

        try {
            // Validate timeout days
            if (type === 'timeout' && !days) {
                await this.interaction.editReply({
                    content: "❌ יש לציין מספר ימים עבור טיים אאוט"
                });
                return;
            }

            if (type === 'timeout' && (days! < 1 || days! > 27)) {
                await this.interaction.editReply({
                    content: "❌ מספר הימים חייב להיות בין 1 ל-27"
                });
                return;
            }

            // Handle phone number format for WhatsApp users
            let finalUserId = userId;
            let source = 'discord';
            let whatsappNumber: string | undefined;

            if (userId.match(/^(\+?972|0)\d{8,9}$/)) {
                // Phone number format
                const cleanNumber = userId.replace(/\D/g, '');
                const formattedNumber = cleanNumber.startsWith('0') 
                    ? '972' + cleanNumber.substring(1) 
                    : cleanNumber.startsWith('972') 
                        ? cleanNumber 
                        : '972' + cleanNumber;
                
                finalUserId = `whatsapp_${formattedNumber}`;
                source = 'whatsapp';
                whatsappNumber = formattedNumber;
            }

            // Create punishment record
            const punishment = {
                _id: new ObjectId(),
                userId: finalUserId,
                punishType: type,
                reason: reason,
                punisherId: this.interaction.user.id,
                punishDate: new Date(),
                timeoutDays: type === 'timeout' ? days : undefined,
                source: source as 'discord' | 'whatsapp',
                whatsappNumber: whatsappNumber,
                channelName: 'Manual Punishment',
                guildId: this.interaction.guildId || '',
                open: false, // Manual punishments are not tied to specific conversations
                channelId: '', // Manual punishments don't have a channel
                date: new Date(), // Same as punishDate for manual punishments
                subject: 'Manual Punishment' // Default subject for manual punishments
            };

            // Save to database
            await DataBase.punishmentsCollection.insertOne(punishment);

            // Create success embed
            const embed = new EmbedBuilder()
                .setTitle("✅ ענישה נוספה בהצלחה")
                .setColor(0x00ff00)
                .addFields([
                    { name: "מזהה המשתמש", value: userId, inline: true },
                    { name: "סוג הענישה", value: type === 'ban' ? 'באן' : 'טיים אאוט', inline: true },
                    { name: "סיבה", value: reason, inline: false },
                    { name: "נוסף על ידי", value: `${this.interaction.user}`, inline: true }
                ])
                .setTimestamp();

            if (type === 'timeout' && days) {
                embed.addFields([{ name: "מספר ימים", value: days.toString(), inline: true }]);
            }

            await this.interaction.editReply({ embeds: [embed] });

            // Log the addition
            await this.logPunishmentAddition(punishment, this.interaction.user);

        } catch (error) {
            await this.interaction.editReply({
                content: "❌ שגיאה בהוספת הענישה"
            });
            throw error;
        }
    }

    private async getActivePunishments(punishments: any[]): Promise<any[]> {
        const activePunishments = [];
        const now = new Date();

        for (const punishment of punishments) {
            if (punishment.punishType === 'ban') {
                // Bans are permanent
                activePunishments.push(punishment);
            } else if (punishment.punishType === 'timeout') {
                // Check if timeout is still active
                const punishDate = new Date(punishment.punishDate);
                const timeoutDays = punishment.timeoutDays || 27;
                const expiryDate = new Date(punishDate.getTime() + (timeoutDays * 24 * 60 * 60 * 1000));
                
                if (now < expiryDate) {
                    activePunishments.push(punishment);
                }
            }
        }

        return activePunishments;
    }

    private createPunishmentListEmbed(punishments: any[], title: string): EmbedBuilder {
        const embed = new EmbedBuilder()
            .setTitle(`📋 ${title}`)
            .setColor(0xff0000)
            .setTimestamp();

        if (punishments.length === 0) {
            embed.setDescription("אין ענישות פעילות");
            return embed;
        }

        let description = "";
        const displayPunishments = punishments.slice(0, 10); // Limit to 10 for readability

        for (const punishment of displayPunishments) {
            const punishType = punishment.punishType === 'ban' ? '🔴 באן' : '🟡 טיים אאוט';
            const userInfo = this.getUserDisplayInfo(punishment);
            const timeInfo = this.getTimeDisplayInfo(punishment);
            
            description += `**${punishType}** | ${userInfo}\n`;
            description += `📝 **סיבה:** ${punishment.reason}\n`;
            description += `📅 **תאריך:** ${new Date(punishment.punishDate).toLocaleDateString('he-IL')}\n`;
            if (timeInfo) {
                description += `⏱️ **${timeInfo}**\n`;
            }
            description += `🆔 **מזהה:** \`${punishment._id}\`\n`;
            description += "─────────────────────\n";
        }

        if (punishments.length > 10) {
            description += `\n*ועוד ${punishments.length - 10} ענישות...*`;
        }

        embed.setDescription(description);
        embed.setFooter({ text: `סה״ב ${punishments.length} ענישות` });

        return embed;
    }

    private getUserDisplayInfo(punishment: any): string {
        if (punishment.source === 'whatsapp' && punishment.whatsappNumber) {
            return `${punishment.whatsappNumber} (וואטסאפ)`;
        } else {
            const discordMember = Utils.getMemberByID(punishment.userId);
            return discordMember ? `${discordMember}` : punishment.userId || 'לא זמין';
        }
    }

    private getTimeDisplayInfo(punishment: any): string | null {
        if (punishment.punishType === 'timeout' && punishment.timeoutDays) {
            const punishDate = new Date(punishment.punishDate);
            const expiryDate = new Date(punishDate.getTime() + (punishment.timeoutDays * 24 * 60 * 60 * 1000));
            const now = new Date();
            
            if (now < expiryDate) {
                const daysLeft = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                return `פג בעוד ${daysLeft} ימים`;
            } else {
                return "פג תוקף";
            }
        }
        return null;
    }

    private async logPunishmentRemoval(punishment: any, removedBy: User): Promise<void> {
        try {
            const embed = new EmbedBuilder()
                .setTitle("🗑️ ענישה הוסרה")
                .setColor(0xffa500)
                .addFields([
                    { name: "מזהה הענישה", value: punishment._id.toString(), inline: true },
                    { name: "המוענש", value: this.getUserDisplayInfo(punishment), inline: true },
                    { name: "סוג הענישה", value: punishment.punishType === 'ban' ? 'באן' : 'טיים אאוט', inline: true },
                    { name: "סיבה מקורית", value: punishment.reason, inline: false },
                    { name: "הוסר על ידי", value: `${removedBy}`, inline: true }
                ])
                .setTimestamp();

            await ConfigHandler.config.punishmentChannel?.send({ embeds: [embed] });
        } catch (error) {
            console.error('Failed to log punishment removal:', error);
        }
    }

    private async logPunishmentAddition(punishment: any, addedBy: User): Promise<void> {
        try {
            const embed = new EmbedBuilder()
                .setTitle("➕ ענישה נוספה ידנית")
                .setColor(0xff0000)
                .addFields([
                    { name: "מזהה הענישה", value: punishment._id.toString(), inline: true },
                    { name: "המוענש", value: this.getUserDisplayInfo(punishment), inline: true },
                    { name: "סוג הענישה", value: punishment.punishType === 'ban' ? 'באן' : 'טיים אאוט', inline: true },
                    { name: "סיבה", value: punishment.reason, inline: false },
                    { name: "נוסף על ידי", value: `${addedBy}`, inline: true }
                ])
                .setTimestamp();

            if (punishment.punishType === 'timeout' && punishment.timeoutDays) {
                embed.addFields([{ name: "מספר ימים", value: punishment.timeoutDays.toString(), inline: true }]);
            }

            await ConfigHandler.config.punishmentChannel?.send({ embeds: [embed] });
        } catch (error) {
            console.error('Failed to log punishment addition:', error);
        }
    }
}

export default PunishmentManager;