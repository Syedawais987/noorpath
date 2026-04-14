import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendBroadcastWhatsApp } from "@/lib/whatsapp";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { templateName } = body;

    if (!templateName) {
      return NextResponse.json({ error: "Template name required" }, { status: 400 });
    }

    const students = await prisma.user.findMany({
      where: {
        role: { in: ["STUDENT", "PARENT"] },
        whatsappOptedIn: true,
        phone: { not: null },
      },
      select: { phone: true, name: true },
    });

    const recipients = students
      .filter((s): s is { phone: string; name: string } => !!s.phone)
      .map((s) => ({ phone: s.phone, name: s.name }));

    await sendBroadcastWhatsApp(recipients, templateName);

    return NextResponse.json({
      message: `Broadcast sent to ${recipients.length} students`,
      count: recipients.length,
    });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
