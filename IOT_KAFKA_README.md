# Smart Infrastructure IoT Kafka System

## Overview

This system implements Kafka-based IoT telemetry ingestion for a smart infrastructure platform with:

- **Python Kafka Producer**: Simulates realistic sensor data for 4 infrastructure structures
- **Next.js Kafka Consumer**: Background worker that processes telemetry and stores in PostgreSQL
- **Admin Dashboard**: Web interface for managing structures and sensors  
- **REST API**: Endpoints for sensor subscription, telemetry retrieval, and health monitoring

## Architecture

```
IoT Sensors → Python Producer → Kafka Topics → Next.js Consumer → PostgreSQL
                                     ↓
                              Admin Dashboard & REST API
```

## Prerequisites

- Kafka running on localhost:9092
- PostgreSQL database
- Node.js 18+
- Python 3.8+

## Quick Start

### 1. Setup

```bash
chmod +x setup_iot.sh
./setup_iot.sh
```

This will:
- Install Python and Node.js dependencies
- Create Kafka topics
- Update database schema

### 2. Start Services

**Terminal 1 - Kafka Consumer:**
```bash
cd frontend
npm run kafka:consumer
```

**Terminal 2 - Next.js Server:**
```bash
cd frontend  
npm run dev
```

**Terminal 3 - Python Producer:**
```bash
cd python-back
python kafka_producer.py
```

### 3. Access Admin Dashboard

Visit http://localhost:3000/admin to:
- Create structures and sensors
- Subscribe/unsubscribe sensors from Kafka ingestion
- View telemetry data and health metrics

## Kafka Topics

- `iot.telemetry.water` - Water flow and pressure sensors
- `iot.telemetry.energy` - Voltage and current sensors  
- `iot.telemetry.pressure` - Pipeline pressure sensors
- `iot.telemetry.vibration` - Bridge vibration sensors

## Sensor Configuration

The system uses 8 predefined sensors across 4 structures:

**STRUCTURE_1 (Water System):**
- SENSOR_001: Water flow meter
- SENSOR_002: Pressure sensor

**STRUCTURE_2 (Power Grid):**  
- SENSOR_003: Voltage meter
- SENSOR_004: Current meter

**STRUCTURE_3 (Pipeline):**
- SENSOR_005: Pressure sensor
- SENSOR_006: Temperature sensor

**STRUCTURE_4 (Bridge):**
- SENSOR_007: Vibration sensor  
- SENSOR_008: Temperature sensor

## API Endpoints

### Structures
- `POST /api/structures` - Create structure
- `GET /api/structures` - List all structures  
- `GET /api/structures/{id}/health` - Get health summary

### Sensors  
- `POST /api/sensors` - Create sensor
- `GET /api/sensors` - List all sensors
- `POST /api/sensors/{id}/subscribe` - Enable Kafka ingestion
- `POST /api/sensors/{id}/unsubscribe` - Disable ingestion
- `GET /api/sensors/{id}/telemetry` - Fetch telemetry data

## Data Flow

1. **Producer** generates realistic sensor values with anomaly injection (5-10%)
2. **Kafka** receives messages on topic-specific channels
3. **Consumer** processes messages and:
   - Validates sensor exists and is subscribed  
   - Stores telemetry in `SensorTelemetry` table
   - Creates anomaly records for out-of-range values
   - Updates sensor heartbeat timestamps
4. **API** provides access to stored data and health metrics

## Anomaly Detection

The system automatically detects anomalies based on:
- Predefined safe threshold ranges per sensor type
- Message metadata from producer
- Severity calculation (LOW, MEDIUM, HIGH, CRITICAL)
- Anomaly type classification (WATER_LEAK, PRESSURE_DROP, etc.)

## Monitoring

**Consumer Logs:**
```bash
📨 Processing message from SENSOR_001
✅ Stored telemetry: SENSOR_001 = 150.5 L/min
🚨 ANOMALY CREATED: WATER_LEAK - HIGH severity
```

**Producer Logs:**  
```bash
📊 SENSOR_001: 150.5 L/min
🚨 ANOMALY detected: SENSOR_003 = 260.0 V
```

**Health Dashboard:**
- Overall structure health status
- Sensor online/offline status  
- Anomaly counts and severity breakdown
- Telemetry statistics

## Scaling

- Increase Kafka partitions for higher throughput
- Add more consumer instances for parallel processing
- Implement sensor auto-discovery
- Add real-time alerting for critical anomalies

## Troubleshooting

**Consumer not receiving messages:**
- Check Kafka is running: `kafka-topics --list --bootstrap-server localhost:9092`
- Verify sensor is subscribed in admin dashboard
- Check consumer group: `kafka-consumer-groups --bootstrap-server localhost:9092 --list`

**Producer connection issues:**
- Verify Kafka broker accessibility
- Check topic permissions
- Review producer logs for connection errors

**Database issues:**
- Run `npx prisma db push` to sync schema
- Check PostgreSQL connection in .env
- View Prisma logs for query errors