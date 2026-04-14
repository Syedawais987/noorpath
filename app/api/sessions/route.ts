import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Auto-complete sessions past their end time
    const now = new Date();
    await prisma.session.updateMany({
      where: {
        studentId: session.user.id,
        status: "SCHEDULED",
        endTime: { lt: now },
      },
      data: { status: "COMPLETED" },
    });

    const sessions = await prisma.session.findMany({
      where: { studentId: session.user.id },
      include: { teacher: { select: { name: true } } },
      orderBy: { startTime: "desc" },
    });

    return NextResponse.json({ sessions });
  } catch {
    return NextResponse.json({ sessions: [] });
  }
}
