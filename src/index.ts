import { RedisClient } from "./api/v1/common/utils/redis.client";
import app from "./app/app";
import { env } from "./app/config/env";
import { connectDB } from "./app/db/connectDB";
import { kafkaConsumer } from "./app/kafka/consumer";
import logger from "./app/utils/logger";

process.on("uncaughtException", (err: Error) => {
    logger.error("💥 Uncaught Exception! Shutting down...");
    logger.error(err.stack || err.message);
    process.exit(1);
});

const startServer = async () => {
    let server: any;
    const redis = RedisClient.getInstance(); // auto-connects

    try {
        // ---------------- DB ----------------
        await connectDB();

        // ---------------- REDIS ----------------
        const redisReady = await redis.ping();
        if (!redisReady) {
            throw new Error("Redis ping failed");
        }
        logger.info("🔴 Redis is ready");

        // ---------------- KAFKA ----------------
        await kafkaConsumer.consumeUserCreated();
        logger.info("🎧 Kafka consumer listening for user-created events");

        // ---------------- SERVER ----------------
        server = app.listen(env.PORT, () => {
            logger.info(
                `🚀 Server running on http://localhost:${env.PORT} in ${env.NODE_ENV} mode`
            );
        });

    } catch (err: any) {
        logger.error("❌ Failed to start server");
        logger.error(err?.stack || err.message);
        process.exit(1);
    }

    // ---------------- SHUTDOWN HANDLERS ----------------
    const shutdown = async (signal: string) => {
        logger.info(`👋 ${signal} received. Shutting down gracefully...`);

        try {
            await kafkaConsumer.disconnect();
            await redis.disconnect();
        } catch (err) {
            logger.error("⚠️ Error during shutdown", err);
        }

        if (server) {
            server.close(() => {
                logger.info("💤 Server stopped");
                process.exit(0);
            });
        } else {
            process.exit(0);
        }
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));

    process.on("unhandledRejection", async (err: any) => {
        logger.error("💥 Unhandled Rejection!");
        logger.error(err?.stack || err);
        await shutdown("unhandledRejection");
    });
};

startServer();
