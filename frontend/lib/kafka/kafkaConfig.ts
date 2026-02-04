/**
 * Kafka Configuration
 * Centralized Kafka client setup for producers and consumers
 */

import { Kafka, logLevel } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'smart-infrastructure-platform',
  brokers: ['localhost:9092'],
  logLevel: logLevel.INFO,
  retry: {
    initialRetryTime: 100,
    retries: 8
  },
  requestTimeout: 30000,
  connectionTimeout: 3000
});

/**
 * Create Kafka consumer with optimized settings
 */
export function createKafkaConsumer(groupId: string) {
  return kafka.consumer({
    groupId,
    sessionTimeout: 25000,
    rebalanceTimeout: 60000,
    heartbeatInterval: 3000,
    maxWaitTimeInMs: 5000,
    retry: {
      retries: 5,
      initialRetryTime: 300
    },
    // Process messages in order per partition
    partitionsConsumedConcurrently: 1
  });
}

/**
 * Create Kafka producer with optimized settings
 */
export function createKafkaProducer() {
  return kafka.producer({
    allowAutoTopicCreation: true,
    transactionTimeout: 30000,
    retry: {
      retries: 5,
      initialRetryTime: 100
    }
  });
}

/**
 * Get Kafka admin client
 */
export function getKafkaAdmin() {
  return kafka.admin();
}

export { kafka };