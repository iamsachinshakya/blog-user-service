import app from "./app/app";
import { env } from "./app/config/env";
import { connectDB } from "./app/db/connectDB";
import { kafkaConsumer } from "./app/kafka/consumer"; // only consumer
import logger from "./app/utils/logger";

process.on("uncaughtException", (err: Error) => {
    logger.error("💥 Uncaught Exception! Shutting down...");
    logger.error(err.stack || err.message);
    process.exit(1);
});

const startServer = async () => {
    try {
        // 1️⃣ Connect DB
        await connectDB();

        // 2️⃣ Start Kafka consumer
        await kafkaConsumer.consumeUserCreated();
        logger.info("🎧 Kafka consumer listening for user-created events");

        // 3️⃣ Start server
        const server = app.listen(env.PORT, () => {
            logger.info(`🚀 Server running on http://localhost:${env.PORT} in ${env.NODE_ENV} mode`);
        });

        // 4️⃣ Handle unhandled promise rejections
        process.on("unhandledRejection", async (err: any) => {
            logger.error("💥 Unhandled Rejection! Shutting down...");
            logger.error(err?.stack || err);

            await kafkaConsumer.disconnect();
            server.close(() => process.exit(1));
        });

        // 5️⃣ Graceful shutdown on SIGTERM / SIGINT
        const shutdown = async () => {
            logger.info("👋 SIGTERM/SIGINT received. Shutting down gracefully...");
            await kafkaConsumer.disconnect();
            server.close(() => logger.info("💤 Server and Kafka consumer stopped"));
        };

        process.on("SIGTERM", shutdown);
        process.on("SIGINT", shutdown);

    } catch (err: any) {
        logger.error("❌ Failed to start server:", err?.stack || err.message);
        process.exit(1);
    }
};

startServer();
