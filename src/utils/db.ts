import { MongoClient, Collection, Db } from "mongodb";
import { CONSTANTS } from "./Constants";
import { 
    Conversation, 
    ConfigDocument, 
    CustomMessage, 
    Volunteer, 
    Report, 
    Suggestion, 
    Punish,
    WhatsAppUser
} from "./types";
require("dotenv").config();

class DatabaseManager {
    private _client: MongoClient | null = null;
    private _database: Db | null = null;
    private _isConnected = false;

    constructor() {
        if (!process.env.MongoURL) {
            throw new Error('MongoDB URL is not provided in environment variables');
        }
        this._client = new MongoClient(process.env.MongoURL, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
    }

    get client(): MongoClient {
        if (!this._client) {
            throw new Error('Database client not initialized');
        }
        return this._client;
    }

    get database(): Db {
        if (!this._database) {
            this._database = this.client.db(CONSTANTS.DATABASE.NAME);
        }
        return this._database;
    }

    get isConnected(): boolean {
        return this._isConnected;
    }

    async connect(): Promise<void> {
        if (this._isConnected) {
            return;
        }
        
        try {
            await this._client?.connect();
            this._isConnected = true;
            console.log('Successfully connected to MongoDB');
        } catch (error) {
            console.error('Failed to connect to MongoDB:', error);
            throw error;
        }
    }

    async disconnect(): Promise<void> {
        if (!this._isConnected || !this._client) {
            return;
        }
        
        try {
            await this._client.close();
            this._isConnected = false;
            console.log('Disconnected from MongoDB');
        } catch (error) {
            console.error('Error disconnecting from MongoDB:', error);
            throw error;
        }
    }

    // Typed collection getters
    get conversationsCollection(): Collection<Conversation> {
        return this.database.collection<Conversation>(CONSTANTS.DATABASE.COLLECTIONS.CONVERSATIONS);
    }

    get configCollection(): Collection<ConfigDocument> {
        return this.database.collection<ConfigDocument>(CONSTANTS.DATABASE.COLLECTIONS.CONFIG);
    }

    get embedMessagesCollection(): Collection<CustomMessage> {
        return this.database.collection<CustomMessage>(CONSTANTS.DATABASE.COLLECTIONS.EMBED_MESSAGES);
    }

    get volunteerCollection(): Collection<Volunteer> {
        return this.database.collection<Volunteer>(CONSTANTS.DATABASE.COLLECTIONS.VOLUNTEER);
    }

    get reportCollection(): Collection<Report> {
        return this.database.collection<Report>(CONSTANTS.DATABASE.COLLECTIONS.REPORTS);
    }

    get suggestionCollection(): Collection<Suggestion> {
        return this.database.collection<Suggestion>(CONSTANTS.DATABASE.COLLECTIONS.SUGGESTIONS);
    }

    get punishmentsCollection(): Collection<Punish> {
        return this.database.collection<Punish>(CONSTANTS.DATABASE.COLLECTIONS.PUNISHMENTS);
    }

    get whatsappUsersCollection(): Collection<WhatsAppUser> {
        return this.database.collection<WhatsAppUser>('WhatsAppUsers');
    }

    // Health check method
    async healthCheck(): Promise<boolean> {
        try {
            await this.database.admin().ping();
            return true;
        } catch {
            return false;
        }
    }

    // Create indexes for better performance
    async createIndexes(): Promise<void> {
        try {
            // Conversations indexes
            await this.conversationsCollection.createIndex({ userId: 1, open: 1 });
            await this.conversationsCollection.createIndex({ channelId: 1 });
            await this.conversationsCollection.createIndex({ channelNumber: 1 });
            await this.conversationsCollection.createIndex({ date: -1 });

            // Reports indexes
            await this.reportCollection.createIndex({ userId: 1 });
            await this.reportCollection.createIndex({ createdAt: -1 });

            // Suggestions indexes
            await this.suggestionCollection.createIndex({ userId: 1 });
            await this.suggestionCollection.createIndex({ createdAt: -1 });

            // Volunteer indexes
            await this.volunteerCollection.createIndex({ userId: 1 });
            await this.volunteerCollection.createIndex({ createdAt: -1 });

            // Punishments indexes
            await this.punishmentsCollection.createIndex({ userId: 1 });
            await this.punishmentsCollection.createIndex({ punishDate: -1 });

            // WhatsApp Users indexes
            await this.whatsappUsersCollection.createIndex({ phoneNumber: 1 }, { unique: true });
            await this.whatsappUsersCollection.createIndex({ isBanned: 1 });

            console.log('Database indexes created successfully');
        } catch (error) {
            console.error('Error creating database indexes:', error);
        }
    }
}

// Create singleton instance
const DataBase = new DatabaseManager();

export default DataBase;