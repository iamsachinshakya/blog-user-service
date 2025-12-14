import { Kafka, Consumer, EachMessagePayload } from "kafkajs";
import { IUserEntity } from "../../api/v1/users/models/user.entity";
import logger from "../utils/logger";
import { UserService } from "../../api/v1/users/services/user.service";
import { UserRepository } from "../../api/v1/users/repositories/user.repository";

export interface UserCreatedEvent {
    id: string;
    email: string;
    username: string;
    role: string;
    status: string;
    createdAt: Date;
}

class KafkaConsumerService {
    private consumer: Consumer;
    private readonly kafka: Kafka;
    private isConnected = false;

    constructor(groupId = "user-service-group") {
        this.kafka = new Kafka({
            clientId: "user-service",
            brokers: [process.env.KAFKA_BROKERS || "localhost:9092"],
        });

        this.consumer = this.kafka.consumer({ groupId });
    }

    async connect(): Promise<void> {
        if (!this.isConnected) {
            await this.consumer.connect();
            logger.info("Kafka consumer connected");
            this.isConnected = true;
        }
    }

    async consumeUserCreated(): Promise<void> {
        await this.connect();

        await this.consumer.subscribe({
            topic: "user-created",
            fromBeginning: false,
        });

        logger.info("Subscribed to topic: user-created");

        await this.consumer.run({
            eachMessage: async ({ message }: EachMessagePayload) => {
                if (!message.value) return;

                try {
                    const event: UserCreatedEvent = JSON.parse(message.value.toString());
                    logger.debug(`Received Kafka event: ${JSON.stringify(event)}`);

                    const user: IUserEntity = {
                        id: event.id,
                        fullName: event.username,
                        avatar: null,
                        bio: "",
                        socialLinks: { twitter: null, linkedin: null, github: null, website: null },
                        followers: [],
                        following: [],
                        preferences: {
                            emailNotifications: true,
                            marketingUpdates: false,
                            twoFactorAuth: false,
                        },
                        createdAt: new Date(event.createdAt),
                        updatedAt: new Date(event.createdAt),
                    };
                    const userRepository = new UserRepository()
                    const userService = new UserService(userRepository)
                    await userService.createUser(user);

                    logger.info(`User saved to DB: ${user.id}`);
                } catch (err: any) {
                    logger.error("Error consuming user-created message", {
                        error: err.message,
                        stack: err.stack,
                    });
                }
            },
        });
    }

    async disconnect(): Promise<void> {
        if (this.isConnected) {
            await this.consumer.disconnect();
            this.isConnected = false;
            logger.warn("Kafka consumer disconnected");
        }
    }
}

export const kafkaConsumer = new KafkaConsumerService();
