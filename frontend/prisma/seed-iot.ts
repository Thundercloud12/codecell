/**
 * IoT Infrastructure Seed Script
 * Creates structures and sensors matching the Kafka producer configuration
 * Run with: npx tsx prisma/seed-iot.ts
 */

import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";

// Load environment and create adapter
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🏗️  Seeding IoT Infrastructure...\n");

  // Create 4 Structures matching the Kafka producer
  const structures = await Promise.all([
    prisma.structure.upsert({
      where: { id: "STRUCTURE_1" },
      update: {},
      create: {
        id: "STRUCTURE_1",
        name: "Water Distribution Hub A",
        structureType: "PIPELINE",
        zone: "Zone-North",
        latitude: 19.076,
        longitude: 72.8777,
        installedAt: new Date("2020-01-15"),
        expectedLifespanYears: 25,
        conditionScore: 85.5,
        riskScore: 0.15,
      },
    }),
    prisma.structure.upsert({
      where: { id: "STRUCTURE_2" },
      update: {},
      create: {
        id: "STRUCTURE_2",
        name: "Power Substation B",
        structureType: "SUBSTATION",
        zone: "Zone-East",
        latitude: 19.082,
        longitude: 72.885,
        installedAt: new Date("2018-06-20"),
        expectedLifespanYears: 30,
        conditionScore: 78.2,
        riskScore: 0.22,
      },
    }),
    prisma.structure.upsert({
      where: { id: "STRUCTURE_3" },
      update: {},
      create: {
        id: "STRUCTURE_3",
        name: "Gas Pipeline Junction C",
        structureType: "PIPELINE",
        zone: "Zone-South",
        latitude: 19.065,
        longitude: 72.87,
        installedAt: new Date("2015-03-10"),
        expectedLifespanYears: 20,
        conditionScore: 72.0,
        riskScore: 0.28,
      },
    }),
    prisma.structure.upsert({
      where: { id: "STRUCTURE_4" },
      update: {},
      create: {
        id: "STRUCTURE_4",
        name: "Highway Bridge D",
        structureType: "BRIDGE",
        zone: "Zone-West",
        latitude: 19.055,
        longitude: 72.862,
        installedAt: new Date("2010-09-01"),
        expectedLifespanYears: 50,
        conditionScore: 68.5,
        riskScore: 0.32,
      },
    }),
  ]);

  console.log(`✅ Created ${structures.length} structures`);

  // Create 8 IoT Sensors matching the Kafka producer exactly
  const sensors = await Promise.all([
    // STRUCTURE_1: Water system sensors
    prisma.ioTSensor.upsert({
      where: { sensorCode: "SENSOR_001" },
      update: { isSubscribed: true, isActive: true },
      create: {
        sensorCode: "SENSOR_001",
        sensorType: "WATER_METER",
        topicName: "iot.telemetry.water",
        zone: "Zone-North",
        latitude: 19.076,
        longitude: 72.8777,
        structureId: "STRUCTURE_1",
        isActive: true,
        isSubscribed: true,
        installedAt: new Date("2022-01-15"),
      },
    }),
    prisma.ioTSensor.upsert({
      where: { sensorCode: "SENSOR_002" },
      update: { isSubscribed: true, isActive: true },
      create: {
        sensorCode: "SENSOR_002",
        sensorType: "PRESSURE_SENSOR",
        topicName: "iot.telemetry.pressure",
        zone: "Zone-North",
        latitude: 19.0762,
        longitude: 72.878,
        structureId: "STRUCTURE_1",
        isActive: true,
        isSubscribed: true,
        installedAt: new Date("2022-01-15"),
      },
    }),

    // STRUCTURE_2: Power grid sensors
    prisma.ioTSensor.upsert({
      where: { sensorCode: "SENSOR_003" },
      update: { isSubscribed: true, isActive: true },
      create: {
        sensorCode: "SENSOR_003",
        sensorType: "ENERGY_METER",
        topicName: "iot.telemetry.energy",
        zone: "Zone-East",
        latitude: 19.082,
        longitude: 72.885,
        structureId: "STRUCTURE_2",
        isActive: true,
        isSubscribed: true,
        installedAt: new Date("2021-06-20"),
      },
    }),
    prisma.ioTSensor.upsert({
      where: { sensorCode: "SENSOR_004" },
      update: { isSubscribed: true, isActive: true },
      create: {
        sensorCode: "SENSOR_004",
        sensorType: "ENERGY_METER",
        topicName: "iot.telemetry.energy",
        zone: "Zone-East",
        latitude: 19.0822,
        longitude: 72.8852,
        structureId: "STRUCTURE_2",
        isActive: true,
        isSubscribed: true,
        installedAt: new Date("2021-06-20"),
      },
    }),

    // STRUCTURE_3: Pipeline sensors
    prisma.ioTSensor.upsert({
      where: { sensorCode: "SENSOR_005" },
      update: { isSubscribed: true, isActive: true },
      create: {
        sensorCode: "SENSOR_005",
        sensorType: "PRESSURE_SENSOR",
        topicName: "iot.telemetry.pressure",
        zone: "Zone-South",
        latitude: 19.065,
        longitude: 72.87,
        structureId: "STRUCTURE_3",
        isActive: true,
        isSubscribed: true,
        installedAt: new Date("2020-03-10"),
      },
    }),
    prisma.ioTSensor.upsert({
      where: { sensorCode: "SENSOR_006" },
      update: { isSubscribed: true, isActive: true },
      create: {
        sensorCode: "SENSOR_006",
        sensorType: "PRESSURE_SENSOR",
        topicName: "iot.telemetry.temperature",
        zone: "Zone-South",
        latitude: 19.0652,
        longitude: 72.8702,
        structureId: "STRUCTURE_3",
        isActive: true,
        isSubscribed: true,
        installedAt: new Date("2020-03-10"),
      },
    }),

    // STRUCTURE_4: Bridge sensors
    prisma.ioTSensor.upsert({
      where: { sensorCode: "SENSOR_007" },
      update: { isSubscribed: true, isActive: true },
      create: {
        sensorCode: "SENSOR_007",
        sensorType: "VIBRATION_SENSOR",
        topicName: "iot.telemetry.vibration",
        zone: "Zone-West",
        latitude: 19.055,
        longitude: 72.862,
        structureId: "STRUCTURE_4",
        isActive: true,
        isSubscribed: true,
        installedAt: new Date("2019-09-01"),
      },
    }),
    prisma.ioTSensor.upsert({
      where: { sensorCode: "SENSOR_008" },
      update: { isSubscribed: true, isActive: true },
      create: {
        sensorCode: "SENSOR_008",
        sensorType: "TEMPERATURE_SENSOR",
        topicName: "iot.telemetry.temperature",
        zone: "Zone-West",
        latitude: 19.0552,
        longitude: 72.8622,
        structureId: "STRUCTURE_4",
        isActive: true,
        isSubscribed: true,
        installedAt: new Date("2019-09-01"),
      },
    }),
  ]);

  console.log(`✅ Created ${sensors.length} IoT sensors`);

  console.log("\n🏗️  IoT Infrastructure seeding complete!\n");
  
  console.log("📋 Structures:");
  structures.forEach((s) => {
    console.log(`   - ${s.name} (${s.id}): ${s.structureType}`);
  });
  
  console.log("\n📡 Sensors:");
  sensors.forEach((s) => {
    console.log(`   - ${s.sensorCode}: ${s.sensorType} → ${s.topicName}`);
  });

  console.log("\n✅ Ready to receive Kafka messages!");
  console.log("   1. Start Kafka: docker-compose up -d");
  console.log("   2. Start Producer: python kafka_producer.py");
  console.log("   3. Start Consumer: npm run kafka:consumer");
  console.log("   4. View Dashboard: http://localhost:3000/admin/iot");
}

main()
  .catch((e) => {
    console.error("❌ IoT seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
