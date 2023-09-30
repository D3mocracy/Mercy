import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  EmbedBuilder,
  ModalBuilder,
  ModalSubmitInteraction,
  StringSelectMenuBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { Utils } from "../Utils";

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
        { name: "התומך המפנה", value: `${interaction.user.tag}` },
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
        { name: "שם", value: `${user?.username}` },
        { name: "טאג", value: `${user?.tag}` },
        { name: "תיוג", value: `${user}` },
        { name: "מספר משתמש/ID", value: userId },
        { name: "קישור לתמונת הפרופיל", value: user?.avatarURL() || "לא זמין" },
        { name: "קישור לבאנר הפרופיל", value: user?.bannerURL() || "לא זמין" },
        { name: "האם בוט", value: user?.bot ? "כן" : "לא" },
        { name: "תאריך יצירת המשתמש", value: `${user?.createdAt}` },
      ]);
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
        title: `${chatTitle.replaceAll("-", " ")} נסגר`,
        description: `הצ'אט נסגר על ידי ${closedBy}`,
      });
    }

    export const punishMessage = new EmbedBuilder({
      title: "מערכת בקרת עונשים",
      description: "יש לבחור בפעולה הרצויה",
      color: colors.red
    });
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

    // export const punishMember =
    //   new ActionRowBuilder<ButtonBuilder>().addComponents([
    //     new ButtonBuilder({
    //       label: "Ban",
    //       customId: "punish_ban",
    //       emoji: "⛔",
    //       style: ButtonStyle.Danger,
    //     }),
    //     new ButtonBuilder({
    //       label: "Kick",
    //       customId: "punish_kick",
    //       emoji: "🦵",
    //       style: ButtonStyle.Danger,
    //     }),
    //     new ButtonBuilder({
    //       label: "timeout",
    //       customId: "punish_timeout",
    //       emoji: "😶",
    //       style: ButtonStyle.Danger,
    //     }),
    //     new ButtonBuilder({
    //       label: "history",
    //       customId: "punish_history",
    //       emoji: "🗒️",
    //       style: ButtonStyle.Danger,
    //     }),
    //   ]);

    export function punishMenu() {
      const selectMenu = new StringSelectMenuBuilder({
        customId: "punish_menu",
        placeholder: "יש לבחור את הפעולה הרצויה",
      });
      selectMenu.addOptions([
        {
          label: "השתקת משתמש",
          description: "משתיק את המשתמש לזמן מוגדר",
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



    // export const punishMember_mute =
    //   new ActionRowBuilder<ButtonBuilder>().addComponents(
    //     new ButtonBuilder({
    //       label: "Mute",
    //       customId: "punish_timeout",
    //       emoji: "⛔",
    //       style: ButtonStyle.Danger,
    //     })
    //   );

    // export const punishMember_kick =
    //   new ActionRowBuilder<ButtonBuilder>().addComponents(
    //     new ButtonBuilder({
    //       label: "Kick",
    //       customId: "punish_kick",
    //       emoji: "⛔",
    //       style: ButtonStyle.Danger,
    //     })
    //   );
  }

  export namespace Modals {
    //Mute Member Punish
    const muteTime = new ActionRowBuilder<TextInputBuilder>().addComponents(
      new TextInputBuilder({
        customId: "punish_mute_time",
        label: "זמן ההשתקה",
        placeholder: "יש להכניס ערך בין 1 ל-28 בלבד",
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
  }
}
