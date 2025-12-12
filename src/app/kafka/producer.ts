// kafka/producer.ts - Update your producer service
import { Kafka, Producer, Message } from 'kafkajs';

export interface UserCreatedEvent {
    id: string;
    email: string;
    username: string;
    role: string;
    status: string;
    createdAt: Date;
}

class KafkaProducerService {
    private producer: Producer;
    private readonly kafka: Kafka;
    private isConnected: boolean = false;

    constructor() {
        this.kafka = new Kafka({
            clientId: 'auth-service',
            brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
            retry: {
                initialRetryTime: 300,
                retries: 8
            }
        });

        this.producer = this.kafka.producer({
            idempotent: true,
            maxInFlightRequests: 5,
            transactionTimeout: 30000
        });
    }

    async connect(): Promise<void> {
        if (!this.isConnected) {
            await this.producer.connect();
            this.isConnected = true;
            console.log('Kafka producer connected');
        }
    }

    async publishUserCreated(event: UserCreatedEvent): Promise<void> {
        if (!this.isConnected) {
            throw new Error('Producer not connected');
        }

        const message: Message = {
            key: event.id,
            value: JSON.stringify(event),
            headers: {
                'event-type': 'USER_CREATED',
                'timestamp': Date.now().toString(),
                'correlation-id': event.id
            }
        };

        try {
            const result = await this.producer.send({
                topic: 'user-created',
                messages: [message],
                acks: -1,
                timeout: 30000
            });
            console.log('User created event published:', result);
        } catch (error) {
            console.error('Failed to publish user created event:', error);
            // Log to monitoring service (DataDog, Sentry, etc.)
            throw error;
        }
    }

    async disconnect(): Promise<void> {
        if (this.isConnected) {
            await this.producer.disconnect();
            this.isConnected = false;
        }
    }
}

export const kafkaProducer = new KafkaProducerService();
