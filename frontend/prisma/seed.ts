/**
 * Database Seed Script
 * Creates test data for development and testing
 * Run with: npx prisma db seed
 */

import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

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
  console.log("\n📋 Test Workers:");
  workers.forEach((worker) => {
    console.log(`   - ${worker.name} (${worker.employeeId}): ${worker.id}`);
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
