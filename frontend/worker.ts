/**
 * Background Worker for Kafka Consumer
 * This runs as a background process to consume IoT telemetry messages
 */

import "dotenv/config";
import { kafkaConsumerWorker } from './lib/kafka/consumer';
console.log("DATABASE_URL TYPE:", typeof process.env.DATABASE_URL);
console.log("DATABASE_URL VALUE:", process.env.DATABASE_URL);

console.log('🚀 IoT Kafka Consumer Background Worker started');
console.log('📡 Ready to consume telemetry messages from Kafka topics');

// Start the consumer
kafkaConsumerWorker.start().catch((error) => {
  console.error('❌ Failed to start Kafka consumer:', error);
  process.exit(1);
});

// Keep the process alive and handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('📴 Received SIGTERM, shutting down gracefully...');
  await kafkaConsumerWorker.stop();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('📴 Received SIGINT, shutting down gracefully...');
  await kafkaConsumerWorker.stop();
  process.exit(0);
});