import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

// Server-Sent Events endpoint for real-time telemetry updates
export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let lastTimestamp = new Date();
      let isClosed = false;

      const sendData = async () => {
        // Check if controller is closed before attempting to send
        if (isClosed) return;

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

          // Fetch new ML anomalies
          const newMLAnomalies = await prisma.mLAnomalyDetection.findMany({
            where: {
              detectedAt: { gt: lastTimestamp },
              isAnomaly: true,
            },
            orderBy: { detectedAt: "desc" },
            take: 20,
            include: {
              sensor: {
                select: {
                  sensorCode: true,
                  structure: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            },
          });

          // Fetch new ML predictions
          const newMLPredictions = await prisma.mLFailurePrediction.findMany({
            where: {
              predictedAt: { gt: lastTimestamp },
              validUntil: { gt: new Date() },
            },
            orderBy: { predictedAt: "desc" },
            take: 10,
            include: {
              structure: {
                select: {
                  id: true,
                  name: true,
                  structureType: true,
                },
              },
            },
          });

          if (newTelemetry.length > 0 || newAnomalies.length > 0 || newMLAnomalies.length > 0 || newMLPredictions.length > 0) {
            lastTimestamp = new Date();

            const data = JSON.stringify({
              telemetry: newTelemetry,
              anomalies: newAnomalies,
              mlAnomalies: newMLAnomalies,
              mlPredictions: newMLPredictions,
              timestamp: lastTimestamp.toISOString(),
            });

            if (!isClosed) {
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          } else {
            // Send heartbeat
            if (!isClosed) {
              controller.enqueue(encoder.encode(`: heartbeat\n\n`));
            }
          }
        } catch (error) {
          if (!isClosed) {
            console.error("SSE Error:", error);
          }
        }
      };

      // Send initial data
      await sendData();

      // Poll every 2 seconds
      const interval = setInterval(sendData, 2000);

      // Cleanup on close
      request.signal.addEventListener("abort", () => {
        isClosed = true;
        clearInterval(interval);
        try {
          controller.close();
        } catch (e) {
          // Controller already closed
        }
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
