import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { env } from '../config/env';
import logger from '../utils/logger';

const runMigrations = async () => {
    try {
        logger.info('⏳ Running migrations...');

        // Initialize Postgres connection
        const connection = postgres(env.DATABASE_URL, {
            max: 1, // single connection for migrations
            ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
        });

        // Initialize Drizzle ORM
        const db = drizzle(connection);

        // Run migrations
        await migrate(db, { migrationsFolder: './src/app/db/drizzle' });

        logger.info('✅ Migrations completed successfully!');

        // Close connection
        await connection.end();
        process.exit(0);
    } catch (err: any) {
        logger.error('❌ Migration failed:', err);
        process.exit(1);
    }
};

// Execute
runMigrations();
