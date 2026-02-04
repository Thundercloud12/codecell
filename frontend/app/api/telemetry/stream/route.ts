import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

// Server-Sent Events endpoint for real-time telemetry updates
export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let lastTimestamp = new Date();

      const sendData = async () => {
        try {
          // Fetch new telemetry since last check
          const newTelemetry = await prisma.sensorTelemetry.findMany({
            where: {
              createdAt: { gt: lastTimestamp },
            },
            orderBy: { timestamp: "desc" },
            take: 50,
            include: {
              sensor: {
                select: {
                  sensorCode: true,
                  sensorType: true,
                  structure: {
                    select: {
                      name: true,
                      structureType: true,
                    },
                  },
                },
              },
            },
          });

          // Fetch new anomalies
          const newAnomalies = await prisma.utilityAnomaly.findMany({
            where: {
              detectedAt: { gt: lastTimestamp },
            },
            orderBy: { detectedAt: "desc" },
            take: 10,
            include: {
              sensor: {
                select: {
                  sensorCode: true,
                  sensorType: true,
                },
              },
            },
          });

          if (newTelemetry.length > 0 || newAnomalies.length > 0) {
            lastTimestamp = new Date();

            const data = JSON.stringify({
              telemetry: newTelemetry,
              anomalies: newAnomalies,
              timestamp: lastTimestamp.toISOString(),
            });

            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          } else {
            // Send heartbeat
            controller.enqueue(encoder.encode(`: heartbeat\n\n`));
          }
        } catch (error) {
          console.error("SSE Error:", error);
        }
      };

      // Send initial data
      await sendData();

      // Poll every 2 seconds
      const interval = setInterval(sendData, 2000);

      // Cleanup on close
      request.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
