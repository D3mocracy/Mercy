import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  EmbedBuilder,
  GuildMember,
  ModalBuilder,
  ModalSubmitInteraction,
  StringSelectMenuBuilder,
  TextChannel,
  TextInputBuilder,
  TextInputStyle,
  User,
} from "discord.js";
import { Utils } from "../Utils";
import { Conversation } from "../types";

export namespace ConversationManageMessageUtils {
  export namespace EmbedMessages {
    const author = {
      iconURL: "https://i.imgur.com/ATfQQi7.png",
      name: "Mercy - אנונימי",
    };
    const colors = {
      blue: 0x86b5dd,
      pink: 0xfe929f,
      gold: 0xfcc22d,
      red: 0xff0000,
      green: 0x33c76e,
      white: 0xffffff,
    };

    export function referSupervisor(interaction: ModalSubmitInteraction) {
      return new EmbedBuilder({
        color: colors.white,
        title: "התקבלה בקשה להפניית מפקח",
        description: `**תיאור**\n${interaction.fields.getTextInputValue("referCause")}`,
      }).addFields([
        { name: "המפנה", value: `${interaction.user}` },
        { name: "בטיפול של", value: "לא משויך" },
        { name: "סטטוס טיפול", value: `לא טופל` },
      ]);
    }

    export function criticalChat(interaction: ModalSubmitInteraction) {
      return new EmbedBuilder({
        color: colors.red,
        title: "התקבל דיווח על צ'אט קריטי",
        description: `**סיבה**\n${interaction.fields.getTextInputValue("critical_chat_reason")}`,
        timestamp: new Date(),
      }).addFields([
        { name: "המדווח", value: `${interaction.user}` },
        { name: "צ'אט", value: `${(interaction.channel as TextChannel).name}` },
        { name: "בטיפול של", value: "לא משויך" },
        { name: "סטטוס טיפול", value: `לא טופל` },
      ]);
    }

    export function staffMemberAttached(staffMemberUsername: string) {
      return new EmbedBuilder({
        color: colors.white,
        title: `הצ'אט שויך לתומכ/ים שנבחר/ו`,
        description: `כעת יש ל${staffMemberUsername} גישה מלאה לכתיבה בצ'אט`,
      });
    }

    export const ManagerTools = new EmbedBuilder({
      color: colors.white,
      title: "הגדרות ניהול",
      description:
        "באמצעות הכפתורים מטה ניתן לבצע פעולות ניהוליות על הצ'אט",
    });

    export function newChatStaff(title: string, description: string) {
      return new EmbedBuilder({
        color: colors.white,
        title,
        description,
      });
    }

    export function unActiveChannels(channels: TextChannel[]) {
      return new EmbedBuilder({
        color: colors.red,
        title: `צ'אטים לא פעילים`,
        description: `רשימת צ'אטים לא פעילים (לא נכתבה הודעה מצד המשתמש ב24 שעות האחרונות)
        ${channels.map(c => `${c}`).join('\n')}
        
        נוסח להודעה לפני סגירה:
        המערכת לא זיהתה הודעה ב-24 השעות האחרונות ולכן הצ'אט נסגר עקב חוסר פעילות. ניתן לפנות אלינו שוב בכל עת על ידי פתיחת צ'אט חדש.`
      }).setTimestamp();
    }

    export async function revealUserMessage(userId: string) {
      const user = Utils.getMemberByID(userId)?.user;
      return new EmbedBuilder({
        color: colors.white,
        title: "פרטי המשתמש",
        description:
          "מנהל יקר, שים לב כי בחרת להפר את מדיניות האנונימיות - עקב כך הפרטים בהודעה בהמשך גלויים אך ורק לך",
        footer: {
          text: "מומלץ להנחות את אחד התומכים להמשיך לדבר עם המשתמש עד לסיום העברת המידע לגורמים הרלוונטים",
        },
      }).addFields([
        { name: "שם", value: user?.username || "לא זמין" },
        { name: "טאג", value: user?.tag || "לא זמין" },
        { name: "תיוג", value: `${user}` || "לא זמין" },
        { name: "מספר משתמש/ID", value: userId || "לא זמין" },
        { name: "קישור לתמונת הפרופיל", value: user?.avatarURL() || "לא זמין" },
        { name: "קישור לבאנר הפרופיל", value: user?.bannerURL() || "לא זמין" },
        { name: "האם בוט", value: user?.bot ? "כן" : "לא" },
        { name: "תאריך יצירת המשתמש", value: user?.createdAt?.toString() || "לא זמין" },
      ]);
    }

    export function findChannel(conversation: Conversation) {
      // Handle staff members safely
      let lastSupporter = "לא משויך";
      if (conversation.staffMemberId && conversation.staffMemberId.length > 0) {
        const staffMembers = Utils.getMembersById(...conversation.staffMemberId)
          .filter(member => member !== undefined && member !== null)
          .map(member => `${member}`)
          .filter(str => str && str.trim() && str !== "undefined");
        
        lastSupporter = staffMembers.length > 0 ? staffMembers.join(", ") : "לא משויך";
      }

      // Handle user safely
      const userInfo = Utils.getMemberByID(conversation.userId);
      let userValue = "לא נמצא";
      if (userInfo) {
        const userStr = `${userInfo}`;
        if (userStr && userStr.trim() && userStr !== "undefined") {
          userValue = userStr;
        }
      }
      
      // Handle subject safely
      const subjectValue = (conversation.subject && conversation.subject.trim()) ? conversation.subject.trim() : "לא צוין";
      
      // Handle timestamp safely
      let timestampValue = "לא זמין";
      if (conversation._id?.getTimestamp) {
        try {
          const timestamp = conversation._id.getTimestamp();
          if (timestamp) {
            timestampValue = `${timestamp}`;
          }
        } catch (error) {
          timestampValue = "לא זמין";
        }
      }

      return new EmbedBuilder({
        color: colors.pink,
        title: `מערכת ניהול למנהלים - מידע על צ'אט`,
        description: `להלן מידע על צ'אט מספר **${conversation.channelNumber || "לא ידוע"}**`,
      }).addFields([
        { name: "משתמש", value: userValue },
        { name: "נושא", value: subjectValue },
        { name: "תומך אחרון", value: lastSupporter },
        { name: "תאריך פתיחה", value: timestampValue }
      ])
    }

    export const changeHelper = new EmbedBuilder({
      color: colors.blue,
      title: "החלפת תומך",
      description:
        "(יש לבחור מתוך הרשימה מטה את התומך שתרצו לשייך אליו את הפנייה (ניתן לבחור יותר מתומך אחד",
      footer: {
        text: "שימו לב כי ההחלפה בין התומכים תשפיע על הרשאות התגובה שלהם בצ'אט בהתאם",
      },
    });

    export const helpersReseted = new EmbedBuilder({
      color: colors.white,
      title: "הרשאות הוסרו",
      description:
        "כל הרשאות התומכים בצ'אט זה אופסו, ניתן כעת להגדיר תומכים חדשים",
    });

    export function chatClosed(closedBy: string, chatTitle: string) {
      return new EmbedBuilder({
        color: colors.red,
        title: `${chatTitle?.replaceAll("-", " ")} נסגר`,
        description: `הצ'אט נסגר על ידי ${closedBy}`,
      });
    }

    export const punishMessage = new EmbedBuilder({
      title: "מערכת בקרת עונשים",
      description: "יש לבחור בפעולה הרצויה",
      color: colors.red
    });

    export function punishDMMessage(punish: "kick" | "ban" | "timeout", reason: string, mayUser: GuildMember) {
      const punishConvert = {
        kick: "קיק (Kick)",
        ban: "חסימה (Ban)",
        timeout: "השתקה (Timeout)"
      }
      return new EmbedBuilder({
        title: `קיבלת ${punishConvert[punish]} מהשרת אתם לא לבד`,
        description: `**סיבה:** ${reason} \n
        ניתן להגיש ערעור למנהלת השרת בהודעה פרטית: ${mayUser}
        `,
        color: colors.red,
        timestamp: new Date(),
      })
    }

    export const actionCancelledCloseChat = new EmbedBuilder({
      title: 'הפעולה בוטלה',
      description: "הצ'אט נשאר פתוח כרגיל",
      color: colors.red,
    });

    export function punishmentHistoryMessage(punishments: any[]) {
      return new EmbedBuilder({
        title: `היסטוריית עונשים`,
        description: `
          ${punishments.length === 0
            ? "למשתמש זה אין עונשים קודמים"
            : punishments.map((p, i) => `
            **עונש ${i + 1}** 
            **סוג העונש:** ${p.punishType}
            **סיבה:** ${p.reason}
            **ניתן בתאריך:** ${p.punishDate as Date}
          `).join('')}
        `,
        color: colors.white
      })
    }
  }


  export namespace Actions {
    export function attachReport(isAttached: boolean) {
      return new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder({
          customId: "manager_attach_report",
          label: "שייך דיווח",
          disabled: isAttached,
          emoji: "🔀",
          style: ButtonStyle.Success,
        })
      );
    }

    export function supervisorRefferedTools(doneDisabled: boolean, inProgressDisabled: boolean) {
      return new ActionRowBuilder<ButtonBuilder>().addComponents(
        [new ButtonBuilder({
          customId: "manager_mark_as_done",
          label: "טופל",
          disabled: doneDisabled,
          emoji: "✅",
          style: ButtonStyle.Success,
        }),
        new ButtonBuilder({
          customId: "manager_in_progress",
          label: "בטיפול",
          disabled: inProgressDisabled,
          emoji: "⏳",
          style: ButtonStyle.Primary,
        })
        ]
      );
    }

    export function tools_report_link(url: string) {
      return new ActionRowBuilder<ButtonBuilder>().addComponents([
        new ButtonBuilder({
          label: "העבר אותי לצ'אט",
          url,
          style: ButtonStyle.Link,
        }),
      ]);
    }

    export function tools_sure_close_yes_no() {
      return new ActionRowBuilder<ButtonBuilder>().addComponents([
        new ButtonBuilder({
          label: "לא",
          customId: "sure_no",
          style: ButtonStyle.Danger,
        }),
        new ButtonBuilder({
          label: "כן",
          customId: "sure_yes",
          style: ButtonStyle.Success,
        }),
      ]);
    }

    export const tools_attach = new ButtonBuilder({
      customId: "tools_attach",
      label: "שיוך צ'אט אליי",
      emoji: "🔀",
      style: ButtonStyle.Success,
    });

    export const tools_manager = new ButtonBuilder({
      customId: "tools_manager",
      label: "הגדרות ניהול",
      emoji: "⚙️",
      style: ButtonStyle.Secondary,
    });

    export const tools_close = new ButtonBuilder({
      customId: "tools_close",
      label: "סגירת הצ'אט",
      emoji: "✖️",
      style: ButtonStyle.Danger,
    });

    export const tools_close_with_id = (conversationId: string) => new ButtonBuilder({
      customId: `tools_close_${conversationId}`,
      label: "סגירת הצ'אט",
      emoji: "✖️",
      style: ButtonStyle.Danger,
    });

    export const tools_report = new ButtonBuilder({
      customId: "tools_refer_manager",
      label: "הפניית מפקח",
      emoji: "🧑‍💼",
      style: ButtonStyle.Primary,
    });

    export const supporterTools =
      new ActionRowBuilder<ButtonBuilder>().addComponents([
        tools_manager,
        tools_attach,
        tools_close,
        tools_report,
      ]);

    export const managerTools =
      new ActionRowBuilder<ButtonBuilder>().addComponents([
        new ButtonBuilder({
          customId: "tools_manager_punish",
          label: "הענשת משתמש",
          emoji: "👊",
          style: ButtonStyle.Secondary
        }),
        new ButtonBuilder({
          customId: "tools_manager_change_supporter",
          label: "החלפת תומך",
          emoji: "🔄",
          style: ButtonStyle.Primary,
        }),
        new ButtonBuilder({
          customId: "tools_manager_reveal",
          label: "חשיפת זהות המשתמש",
          emoji: "👁️",
          style: ButtonStyle.Danger,
        }),
      ]);

    export function changeHelper(helpers: any[]) {
      const selectMenu = new StringSelectMenuBuilder({
        customId: "helpers_list",
        placeholder: "יש לבחור תומך אחד או יותר",
        minValues: 1,
        maxValues: helpers.length,
      });
      helpers.forEach((helper) => {
        selectMenu.addOptions({
          label: helper.displayName,
          value: helper.id,
        });
      });
      return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        selectMenu
      );
    }

    export const resetHelpers =
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder({
          label: "הסרת הרשאות לכל התומכים",
          customId: "tools_reset_helpers",
          emoji: "🗑️",
          style: ButtonStyle.Danger,
        })
      );

    export function punishMenu() {
      const selectMenu = new StringSelectMenuBuilder({
        customId: "punish_menu",
        placeholder: "יש לבחור את הפעולה הרצויה",
      });
      selectMenu.addOptions([
        {
          label: "השתקת משתמש",
          description: "משתיק את המשתמש לזמן מוגדר (Timeout)",
          value: "punish_timeout",
          emoji: "⏳"
        },
        {
          label: "הסרת משתמש מהשרת",
          description: "מעניק קיק למשתמש",
          value: "punish_kick",
          emoji: "🦵"
        },
        {
          label: "חסימת משתמש מהשרת לצמיתות",
          description: "מעניק באן למשתמש",
          value: "punish_ban",
          emoji: "⛔"
        },
        {
          label: "היסטוריית ענישות",
          description: "מציג את הענישות הקודמות של המשתמש",
          value: "punish_history",
          emoji: "📜"
        },

      ]);

      return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);
    }

  }

  export namespace Modals {



    //Mute Member Punish
    const muteTime = new ActionRowBuilder<TextInputBuilder>().addComponents(
      new TextInputBuilder({
        customId: "punish_mute_time",
        label: "זמן ההשתקה",
        placeholder: "יש להכניס ערך בין 1 ל-27 בלבד",
        max_length: 2,
        min_length: 1,
        style: TextInputStyle.Short,
        required: true,
      }),
    );

    const muteCause = new ActionRowBuilder<TextInputBuilder>().addComponents(
      new TextInputBuilder({
        customId: "punish_mute_cause",
        label: "סיבת ההשתקה",
        placeholder: "יש לציין סיבה ברורה להשתקה - הסיבה נשלחת למשתמש בהודעה פרטית!",
        style: TextInputStyle.Paragraph,
        required: true,
      }),
    );

    export const punishMuteModal = new ModalBuilder({
      customId: "punishMuteModal",
      title: "השתקת משתמש",
    }).addComponents([muteTime, muteCause]);

    //Kick Member Punish
    const kickMemberTextInputs = new ActionRowBuilder<TextInputBuilder>().addComponents([
      new TextInputBuilder({
        customId: "punish_kick_reason",
        label: "סיבת ההסרה",
        placeholder: "יש לציין סיבה ברורה להסרה - הסיבה נשלחת למשתמש בהודעה פרטית!",
        style: TextInputStyle.Paragraph,
        required: true,
      }),
    ]);

    export const punishKickModal = new ModalBuilder({
      customId: "punishKickModal",
      title: "הסרת משתמש מהשרת",
    }).addComponents(kickMemberTextInputs);

    //Ban Member Punish
    const banMemberTextInputs = new ActionRowBuilder<TextInputBuilder>().addComponents([
      new TextInputBuilder({
        customId: "punish_ban_reason",
        label: "סיבת החסימה",
        placeholder: "יש לציין סיבה ברורה לחסימה - הסיבה נשלחת למשתמש בהודעה פרטית!",
        style: TextInputStyle.Paragraph,
        required: true,
      }),
    ]);

    export const punishBanModal = new ModalBuilder({
      customId: "punishBanModal",
      title: "חסימת משתמש מהשרת לצמיתות",
    }).addComponents(banMemberTextInputs);

    //Critical Chat Reason
    const criticalChatReason = new ActionRowBuilder<TextInputBuilder>().addComponents([
      new TextInputBuilder({
        customId: "critical_chat_reason",
        label: "סיבה",
        placeholder: "יש לציין את הסיבה לדיווח הצ'אט כקריטי, לדוגמה: משתמש מאיים להתאבד",
        style: TextInputStyle.Paragraph,
        required: true,
      }),
    ]);

    export const criticalChatModal = new ModalBuilder({
      customId: "criticalChatModal",
      title: "דיווח כצ'אט קריטי",
    }).addComponents(criticalChatReason);
  }
}
