/**
 * Database Seed Script
 * Creates test data for development and testing
 * Run with: npx prisma db seed
 */

import { PrismaClient } from "@/lib/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Create structures for IoT sensors (skip if exist)
  console.log("🏗️  Creating infrastructure structures...");
  const structureData = [
    { id: "STRUCTURE_1", name: "Water Treatment Plant A", structureType: "PIPELINE", zone: "Mumbai Central", latitude: 19.076, longitude: 72.8777 },
    { id: "STRUCTURE_2", name: "Power Grid Station B", structureType: "SUBSTATION", zone: "Mumbai East", latitude: 19.082, longitude: 72.885 },
    { id: "STRUCTURE_3", name: "Pipeline Junction C", structureType: "PIPELINE", zone: "Mumbai South", latitude: 19.065, longitude: 72.87 },
    { id: "STRUCTURE_4", name: "Highway Bridge D", structureType: "BRIDGE", zone: "Mumbai North", latitude: 19.09, longitude: 72.88 },
  ];
  
  const structures = [];
  for (const data of structureData) {
    const existing = await prisma.structure.findUnique({ where: { id: data.id } });
    if (!existing) {
      structures.push(await prisma.structure.create({ data: data as any }));
    } else {
      structures.push(existing);
      console.log(`   ℹ️  Structure ${data.id} already exists`);
    }
  }
  console.log(`✅ Created/found ${structures.length} structures`);

  // Create IoT sensors matching kafka_producer.py configurations (skip if exist)
  console.log("📡 Creating IoT sensors...");
  const sensorData = [
    { sensorCode: "SENSOR_001", structureId: "STRUCTURE_1", name: "Water Flow Meter", sensorType: "WATER_METER", latitude: 19.076, longitude: 72.8777 },
    { sensorCode: "SENSOR_002", structureId: "STRUCTURE_1", name: "Water Pressure Sensor", sensorType: "PRESSURE_SENSOR", latitude: 19.076, longitude: 72.8777 },
    { sensorCode: "SENSOR_003", structureId: "STRUCTURE_2", name: "Voltage Monitor", sensorType: "ENERGY_METER", latitude: 19.082, longitude: 72.885 },
    { sensorCode: "SENSOR_004", structureId: "STRUCTURE_2", name: "Current Monitor", sensorType: "ENERGY_METER", latitude: 19.082, longitude: 72.885 },
    { sensorCode: "SENSOR_005", structureId: "STRUCTURE_3", name: "Pipeline Pressure Gauge", sensorType: "PRESSURE_SENSOR", latitude: 19.065, longitude: 72.87 },
    { sensorCode: "SENSOR_006", structureId: "STRUCTURE_3", name: "Pipeline Temperature Sensor", sensorType: "TEMPERATURE_SENSOR", latitude: 19.065, longitude: 72.87 },
    { sensorCode: "SENSOR_007", structureId: "STRUCTURE_4", name: "Bridge Vibration Monitor", sensorType: "VIBRATION_SENSOR", latitude: 19.09, longitude: 72.88 },
    { sensorCode: "SENSOR_008", structureId: "STRUCTURE_4", name: "Bridge Temperature Monitor", sensorType: "TEMPERATURE_SENSOR", latitude: 19.09, longitude: 72.88 },
  ];
  
  const sensors = [];
  for (const data of sensorData) {
    const existing = await prisma.ioTSensor.findUnique({ where: { sensorCode: data.sensorCode } });
    if (!existing) {
      sensors.push(await prisma.ioTSensor.create({ 
        data: {
          ...data,
          isActive: true,
          isSubscribed: true,
          lastHeartbeat: new Date(),
        } as any
      }));
    } else {
      sensors.push(existing);
      console.log(`   ℹ️  Sensor ${data.sensorCode} already exists`);
    }
  }
  console.log(`✅ Created/found ${sensors.length} IoT sensors`);

  // Create test workers
  const workers = await Promise.all([
    prisma.worker.create({
      data: {
        name: "John Smith",
        email: "john.smith@repairs.com",
        phone: "+1-555-0101",
        employeeId: "EMP-001",
        isActive: true,
        currentLatitude: 19.076,
        currentLongitude: 72.8777,
        lastLocationUpdate: new Date(),
      },
    }),
    prisma.worker.create({
      data: {
        name: "Maria Garcia",
        email: "maria.garcia@repairs.com",
        phone: "+1-555-0102",
        employeeId: "EMP-002",
        isActive: true,
        currentLatitude: 19.082,
        currentLongitude: 72.885,
        lastLocationUpdate: new Date(),
      },
    }),
    prisma.worker.create({
      data: {
        name: "David Chen",
        email: "david.chen@repairs.com",
        phone: "+1-555-0103",
        employeeId: "EMP-003",
        isActive: true,
        currentLatitude: 19.065,
        currentLongitude: 72.87,
        lastLocationUpdate: new Date(),
      },
    }),
  ]);

  console.log(`✅ Created ${workers.length} workers`);

  // Create admin user (if User model exists)
  try {
    const admin = await prisma.user.create({
      data: {
        name: "Admin User",
        email: "admin@pothole-system.com",
        role: "ADMIN",
      },
    });
    console.log(`✅ Created admin user: ${admin.email}`);
  } catch (error) {
    console.log("ℹ️  Admin user might already exist");
  }

  console.log("🌱 Seeding complete!");
  console.log("\n📋 Infrastructure:");
  console.log(`   Structures: ${structures.length}`);
  console.log(`   IoT Sensors: ${sensors.length}`);
  console.log("\n📋 Test Workers:");
  workers.forEach((worker) => {
    console.log(`   - ${worker.name} (${worker.employeeId}): ${worker.id}`);
  });
  console.log("\n📡 IoT Sensors:");
  sensors.forEach((sensor) => {
    console.log(`   - ${sensor.sensorCode} (${sensor.sensorType}): ${sensor.name}`);
  });
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
