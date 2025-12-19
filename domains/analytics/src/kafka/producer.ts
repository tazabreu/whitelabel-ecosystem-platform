import { Kafka, Producer, logLevel } from "kafkajs";
import { logger } from "../logger.js";

const KAFKA_BROKERS = (
  process.env.KAFKA_BROKERS || "localhost:9092"
).split(",");
const DEPLOYMENT_ENV = process.env.DEPLOYMENT_ENVIRONMENT || "local";

// Topic name following convention: ecosystem.{env}.analytics.event.recorded
const ANALYTICS_TOPIC = `ecosystem.${DEPLOYMENT_ENV}.analytics.event.recorded`;

let producer: Producer | null = null;
let isConnected = false;

/**
 * Get or create a Kafka producer.
 */
async function getProducer(): Promise<Producer> {
  if (producer && isConnected) {
    return producer;
  }

  const kafka = new Kafka({
    clientId: "analytics-service",
    brokers: KAFKA_BROKERS,
    logLevel: logLevel.WARN,
    retry: {
      initialRetryTime: 100,
      retries: 3,
    },
  });

  producer = kafka.producer({
    allowAutoTopicCreation: true,
    transactionTimeout: 30000,
  });

  try {
    await producer.connect();
    isConnected = true;
    logger.info({ brokers: KAFKA_BROKERS }, "Kafka producer connected");
  } catch (error) {
    logger.error({ error }, "Failed to connect Kafka producer");
    throw error;
  }

  return producer;
}

export interface AnalyticsEvent {
  eventId?: string;
  eventName: string;
  domain: string;
  entity?: string;
  action?: string;
  timestamp?: string;
  journeyId?: string;
  userEcosystemId?: string;
  traceId?: string;
  spanId?: string;
  source?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Publish an analytics event to Kafka.
 */
export async function publishEventToKafka(event: AnalyticsEvent): Promise<void> {
  try {
    const kafkaProducer = await getProducer();

    await kafkaProducer.send({
      topic: ANALYTICS_TOPIC,
      messages: [
        {
          key: event.journeyId || event.eventId || null,
          value: JSON.stringify(event),
          headers: {
            eventName: event.eventName,
            domain: event.domain,
            journeyId: event.journeyId || "",
            userEcosystemId: event.userEcosystemId || "",
          },
        },
      ],
    });

    logger.debug(
      { eventId: event.eventId, topic: ANALYTICS_TOPIC },
      "Event published to Kafka"
    );
  } catch (error) {
    // Log but don't throw - best-effort publishing
    logger.warn(
      { error, eventId: event.eventId },
      "Failed to publish event to Kafka"
    );
  }
}

/**
 * Disconnect the Kafka producer (for graceful shutdown).
 */
export async function disconnectProducer(): Promise<void> {
  if (producer && isConnected) {
    await producer.disconnect();
    isConnected = false;
    producer = null;
    logger.info("Kafka producer disconnected");
  }
}

