import logger from "../utils/logger";
import { connectDB } from "./connectDB";
import { users } from "./schema";
import { seedMultipleTables } from "./seed/seedUtils";
import { getUserSeeds } from "./seed/userSeeds";


async function runSeeder() {
    try {
        logger.info("🌱 Starting database seeding...");

        const db = await connectDB();
        const userSeeds = await getUserSeeds();

        await seedMultipleTables(db, [
            {
                table: users,
                items: userSeeds,
                uniqueKey: "id",
                label: "Users",
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
