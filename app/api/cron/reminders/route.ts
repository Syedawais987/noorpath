import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail, sessionReminderEmail } from "@/lib/email";
import { sendWhatsApp } from "@/lib/whatsapp";

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
      const dateStr = s.startTime.toLocaleDateString();
      const timeStr = s.startTime.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
      const emailContent = sessionReminderEmail(s.student.name, dateStr, timeStr);
      await sendEmail({ to: s.student.email, ...emailContent });

      if (s.student.whatsappOptedIn && s.student.phone) {
        await sendWhatsApp({
          to: s.student.phone,
          templateName: "session_reminder",
          variables: [s.student.name, dateStr, timeStr],
        });
      }
    }

    // 1h reminders — WhatsApp only
    for (const s of sessions1h) {
      if (s.student.whatsappOptedIn && s.student.phone) {
        const timeStr = s.startTime.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
        await sendWhatsApp({
          to: s.student.phone,
          templateName: "session_reminder_1h",
          variables: [s.student.name, timeStr],
        });
      }
    }

    // Overdue invoice check — mark invoices overdue 3 days past due
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const overdueInvoices = await prisma.invoice.findMany({
      where: {
        status: "PENDING",
        dueDate: { lte: threeDaysAgo },
      },
      include: { student: { select: { id: true, name: true, email: true } } },
    });

    for (const inv of overdueInvoices) {
      await prisma.invoice.update({
        where: { id: inv.id },
        data: { status: "OVERDUE" },
      });

      await prisma.notification.create({
        data: {
          userId: inv.student.id,
          type: "invoice_overdue",
          message: `Invoice of ${inv.currency} ${inv.amount.toLocaleString()} is overdue. Please pay as soon as possible.`,
        },
      });
    }

    return NextResponse.json({
      sent: {
        "24h_reminders": sessions24h.length,
        "1h_reminders": sessions1h.length,
        "overdue_invoices": overdueInvoices.length,
      },
    });
  } catch (error) {
    console.error("Cron reminder error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
