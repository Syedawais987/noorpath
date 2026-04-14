import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  // Verify cron secret in production
  const authHeader = request.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();

    // Sessions starting in ~24 hours (between 23h and 25h from now)
    const in23h = new Date(now.getTime() + 23 * 60 * 60 * 1000);
    const in25h = new Date(now.getTime() + 25 * 60 * 60 * 1000);

    // Sessions starting in ~1 hour (between 30min and 90min from now)
    const in30m = new Date(now.getTime() + 30 * 60 * 1000);
    const in90m = new Date(now.getTime() + 90 * 60 * 1000);

    const [sessions24h, sessions1h] = await Promise.all([
      prisma.session.findMany({
        where: {
          status: "SCHEDULED",
          startTime: { gte: in23h, lte: in25h },
        },
        include: {
          student: { select: { name: true, email: true, phone: true, whatsappOptedIn: true } },
        },
      }),
      prisma.session.findMany({
        where: {
          status: "SCHEDULED",
          startTime: { gte: in30m, lte: in90m },
        },
        include: {
          student: { select: { name: true, email: true, phone: true, whatsappOptedIn: true } },
        },
      }),
    ]);

    // 24h reminders — email + WhatsApp
    for (const s of sessions24h) {
      // TODO: Send email via Resend (Phase 7)
      console.log(
        `[DEV] 24h reminder email for ${s.student.email}: session at ${s.startTime.toISOString()}`,
      );

      if (s.student.whatsappOptedIn && s.student.phone) {
        // TODO: Send WhatsApp via Meta API (Phase 7)
        console.log(`[DEV] 24h WhatsApp reminder for ${s.student.phone}`);
      }
    }

    // 1h reminders — WhatsApp only
    for (const s of sessions1h) {
      if (s.student.whatsappOptedIn && s.student.phone) {
        // TODO: Send WhatsApp via Meta API (Phase 7)
        console.log(`[DEV] 1h WhatsApp reminder for ${s.student.phone}`);
      }
    }

    return NextResponse.json({
      sent: {
        "24h_reminders": sessions24h.length,
        "1h_reminders": sessions1h.length,
      },
    });
  } catch (error) {
    console.error("Cron reminder error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
