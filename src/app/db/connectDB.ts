import postgres from "postgres";
import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import logger from "../utils/logger";
import { env } from "../config/env";
import * as schema from "./schema";

let db: PostgresJsDatabase<typeof schema> | null = null;
let client: postgres.Sql | null = null;

/**
 * Connect to PostgreSQL and initialize Drizzle ORM
 */
export const connectDB = async (): Promise<PostgresJsDatabase<typeof schema>> => {
    if (db) {
        logger.debug("⚡ PostgreSQL already initialized — skipping reconnect.");
        return db;
    }

    try {
        // Ensure DATABASE_URL exists
        const POSTGRES_URL = env.DATABASE_URL;
        if (!POSTGRES_URL) throw new Error("DATABASE_URL is missing in environment");

        // Create postgres.js client
        client = postgres(POSTGRES_URL, {
            max: 10,                // Connection pool size
            idle_timeout: 30,       // Idle timeout in seconds
            connect_timeout: 10,    // Connection timeout in seconds
            prepare: false,         // Required for Supabase / pooled connections
            ssl: env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined, // Use SSL only in prod
            onnotice: () => { },      // Optional: suppress notices
        });

        // Test connection
        await client`SELECT 1`;

        // Initialize Drizzle ORM with schema
        db = drizzle(client, { schema });

        logger.info("🐘 PostgreSQL connected successfully");
        logger.debug(`🔌 DB URL: ${POSTGRES_URL}`);

        return db;
    } catch (err: any) {
        logger.error(`❌ Failed to connect to PostgreSQL: ${err.message}`);
        throw err;
    }
};

/**
 * Get the Drizzle ORM database instance
 */
export const getDB = (): PostgresJsDatabase<typeof schema> => {
    if (!db) throw new Error("❌ Database not initialized. Call connectDB() first.");
    return db;
};

/**
 * Gracefully close the PostgreSQL connection
 */
export const closeDB = async (): Promise<void> => {
    if (client) {
        await client.end();
        logger.info("🔌 PostgreSQL connection closed");
        db = null;
        client = null;
    }
};
