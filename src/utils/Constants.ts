export const CONSTANTS = {
    // Channel IDs
    CHANNEL_IDS: {
        TELL_ABOUT_YOURSELF: "1148286189925838858"
    },
    
    // Role IDs
    ROLE_IDS: {
        MEMBER_ROLE: '1164995639743090718',
        PRONOUN_FEMALE: '1148302562009813122',
        PRONOUN_MALE: '1148302563196805231',
        PRONOUN_NEUTRAL: '1148302566640324639',
    },
    
    // Database
    DATABASE: {
        NAME: "Angel",
        COLLECTIONS: {
            CONVERSATIONS: "Conversations",
            CONFIG: "Config", 
            EMBED_MESSAGES: "EmbedMessages",
            VOLUNTEER: "Volunteer",
            REPORTS: "Reports",
            SUGGESTIONS: "Suggestions",
            PUNISHMENTS: "Punishments"
        }
    },
    
    // Messages
    MESSAGES: {
        HEBREW: {
            USER: "משתמש",
            STAFF_MEMBER: "איש צוות",
            NO_MANAGE_PERMISSIONS: "אין לך הרשאות להשתמש בהגדרות ניהול"
        }
    },
    
    // Timers (in milliseconds)
    TIMERS: {
        UNACTIVE_CHECK_INTERVAL: 1000 * 60 * 60, // 1 hour
        TIMEOUT_MAX_DAYS: 27,
        TIMEOUT_MIN_DAYS: 1,
    },
    
    // Bot Configuration
    BOT: {
        ACTIVITY_NAME: "your heart",
        COMMAND_PREFIX: "&"
    },
    
    // Emojis
    EMOJIS: {
        WHITE_HEART: "🤍"
    }
} as const;

export type ConstantsType = typeof CONSTANTS;