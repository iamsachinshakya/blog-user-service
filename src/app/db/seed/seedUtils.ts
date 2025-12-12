// db/seedUtils.ts
import { eq } from "drizzle-orm";
import logger from "../../utils/logger";

export async function seedTable<
    TTable extends Record<string, any>,
    TValue extends Record<string, any>
>(
    db: any,
    table: TTable,
    items: TValue[],
    uniqueKey: keyof TValue & keyof TTable
) {
    for (const item of items) {
        const column = table[uniqueKey]; // drizzle column reference

        const exists = await db
            .select()
            .from(table)
            .where(eq(column, item[uniqueKey]));

        if (exists.length > 0) {
            logger.warn(`⚠️ Exists → ${String(uniqueKey)}: ${item[uniqueKey]} — skipping`);
            continue;
        }

        await db.insert(table).values(item);
        logger.info(`✅ Inserted → ${String(uniqueKey)}: ${item[uniqueKey]}`);
    }
}


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