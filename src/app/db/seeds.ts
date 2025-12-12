// db/seed/index.ts
import logger from "../utils/logger";
import { connectDB } from "./connectDB";
import { authUsers } from "./schema";
import { seedTable } from "./seed/seedUtils";
import { getUserSeeds } from "./seed/userSeeds";

interface SeedConfig<TTable, TValue> {
    table: TTable;
    items: TValue[];
    uniqueKey: keyof TValue;
    label: string;
}

export async function seedMultipleTables(
    db: any,
    configs: SeedConfig<any, any>[]
) {
    for (const cfg of configs) {
        logger.info(`\n🌱 Seeding: ${cfg.label}`);
        logger.info(`----------------------------------`);

        await seedTable(db, cfg.table, cfg.items, cfg.uniqueKey as any);

        logger.info(`✅ Done → ${cfg.label}`);
        logger.info(`----------------------------------\n`);
    }
}

async function runSeeder() {
    try {
        logger.info("🌱 Starting database seeding...");

        const db = await connectDB();
        const userSeeds = await getUserSeeds();

        await seedMultipleTables(db, [
            {
                table: authUsers,
                items: userSeeds,
                uniqueKey: "email",
                label: "Auth Users",
            },
        ]);

        logger.info("🎉 All seeds completed successfully!");
        process.exit(0);
    } catch (err) {
        logger.error("❌ Seeding failed:", err);
        process.exit(1);
    }
}

runSeeder();
