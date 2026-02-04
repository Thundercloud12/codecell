import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("[WEBHOOK] Missing CLERK_WEBHOOK_SIGNING_SECRET");
    return NextResponse.json({ ok: true });
  }

  // ---------------------------------------------------------------------------
  // Verify Svix headers
  // ---------------------------------------------------------------------------
  const svix_id = req.headers.get("svix-id");
  const svix_timestamp = req.headers.get("svix-timestamp");
  const svix_signature = req.headers.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.warn("[WEBHOOK] Missing Svix headers");
    return NextResponse.json({ ok: true });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  let event: WebhookEvent;

  try {
    const wh = new Webhook(WEBHOOK_SECRET);
    event = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("[WEBHOOK] Signature verification failed");
    return NextResponse.json({ ok: true });
  }

  try {
    // ===========================================================================
    // USER CREATED / UPDATED
    // ===========================================================================
    if (event.type === "user.created" || event.type === "user.updated") {
      const {
        id: clerkUserId,
        email_addresses,
        primary_email_address_id,
        first_name,
        last_name,
        public_metadata,
      } = event.data;

      const email = email_addresses.find(
        (e) => e.id === primary_email_address_id,
      )?.email_address;

      if (!email) {
        console.warn("[WEBHOOK] No primary email found, skipping");
        return NextResponse.json({ ok: true });
      }

      const name =
        [first_name, last_name].filter(Boolean).join(" ") ||
        email.split("@")[0];

      // Extract role from public_metadata (ADMIN, CITIZEN, WORKER)
      const role =
        (public_metadata?.role as string)?.toUpperCase() || "CITIZEN";
      const validRoles = ["ADMIN", "CITIZEN", "WORKER"];
      const userRole = validRoles.includes(role) ? role : "CITIZEN";

      console.log(
        `[WEBHOOK] ${event.type} | email=${email} | clerkId=${clerkUserId} | role=${userRole}`,
      );

      // -----------------------------------------------------------------------
      // STEP 1: Look up by Clerk ID (authoritative)
      // -----------------------------------------------------------------------
      let user = await prisma.user.findUnique({
        where: { clerk_user_id: clerkUserId },
        include: { worker: true },
      });

      // -----------------------------------------------------------------------
      // STEP 2: Fallback lookup by email (link only once)
      // -----------------------------------------------------------------------
      if (!user) {
        const userByEmail = await prisma.user.findUnique({
          where: { email },
          include: { worker: true },
        });

        console.log(
          `[WEBHOOK] User lookup by email: ${userByEmail ? "FOUND" : "NOT FOUND"} (ID: ${userByEmail?.id})`,
        );

        if (userByEmail) {
          // 🚨 If already linked to a different Clerk ID → STOP
          if (
            userByEmail.clerk_user_id &&
            userByEmail.clerk_user_id !== clerkUserId
          ) {
            console.error(
              `[WEBHOOK] Clerk ID mismatch for email ${email}. ` +
                `Existing=${userByEmail.clerk_user_id}, Incoming=${clerkUserId}`,
            );
            return NextResponse.json({ ok: true });
          }

          // First-time linking
          user = await prisma.user.update({
            where: { id: userByEmail.id },
            data: {
              clerk_user_id: clerkUserId,
              name,
              role: userRole as any,
            },
            include: { worker: true },
          });
          console.log(
            `[WEBHOOK] User updated (linked Clerk ID): ${user.id} with role ${userRole}`,
          );
        }
      }

      // -----------------------------------------------------------------------
      // STEP 3: Create user if still not found
      // -----------------------------------------------------------------------
      if (!user) {
        user = await prisma.user.create({
          data: {
            clerk_user_id: clerkUserId,
            email,
            name,
            role: userRole as any,
          },
          include: { worker: true },
        });
        console.log(`[WEBHOOK] User created: ${user.id} with role ${userRole}`);
      } else {
        console.log(`[WEBHOOK] User already exists: ${user.id}`);
      }

      // -----------------------------------------------------------------------
      // STEP 4: Create Worker profile if role is WORKER and doesn't exist
      // -----------------------------------------------------------------------
      if (userRole === "WORKER" && !user.worker) {
        try {
          const workerEmployeeId = `EMP-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

          await prisma.worker.create({
            data: {
              userId: user.id,
              name: user.name || "Worker",
              email: user.email,
              employeeId: workerEmployeeId,
              isActive: true,
            },
          });
          console.log(
            `[WEBHOOK] Worker profile created for user ${user.id} with ID ${workerEmployeeId}`,
          );
        } catch (error) {
          console.error(`[WEBHOOK] Failed to create worker profile:`, error);
        }
      }
    }

    // ===========================================================================
    // USER DELETED
    // ===========================================================================
    if (event.type === "user.deleted") {
      const clerkUserId = event.data.id;
      console.log(`[WEBHOOK] user.deleted clerkId=${clerkUserId}`);

      await prisma.user.deleteMany({
        where: { clerk_user_id: clerkUserId },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[WEBHOOK] Unhandled error:", err);
    return NextResponse.json({ ok: true });
  }
}
