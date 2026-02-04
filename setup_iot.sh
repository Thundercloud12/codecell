#!/bin/bash

# Smart Infrastructure IoT Demo Setup Script

echo "🏗️  Setting up Smart Infrastructure IoT System"
echo "=============================================="

# 1. Install Python dependencies
echo "📦 Installing Python Kafka dependencies..."
cd python-back
pip install -r requirements-kafka.txt

# 2. Install Node.js dependencies for Kafka
echo "📦 Installing Node.js Kafka dependencies..."
cd ../frontend
npm install kafkajs

# 3. Create Kafka topics (assumes Kafka is running on localhost:9092)
echo "📡 Creating Kafka topics..."
kafka-topics --create --topic iot.telemetry.water --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1 --if-not-exists
kafka-topics --create --topic iot.telemetry.energy --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1 --if-not-exists  
kafka-topics --create --topic iot.telemetry.pressure --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1 --if-not-exists
kafka-topics --create --topic iot.telemetry.vibration --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1 --if-not-exists

# 4. Push database schema
echo "🗄️  Updating database schema..."
npx prisma db push

echo "✅ Setup complete!"
echo ""
echo "🚀 To start the IoT system:"
echo "1. Start Kafka consumer: npm run kafka:consumer"
echo "2. Start Next.js server: npm run dev" 
echo "3. Start Python producer: cd python-back && python kafka_producer.py"
echo "4. Visit http://localhost:3000/admin to manage sensors"
echo ""
echo "📊 Monitoring:"
echo "- Admin dashboard: http://localhost:3000/admin"
echo "- Sensor health: http://localhost:3000/api/structures/{id}/health"
echo "- Telemetry data: http://localhost:3000/api/sensors/{id}/telemetry"