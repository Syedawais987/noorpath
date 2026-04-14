import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    await prisma.sessionNote.upsert({
      where: { sessionId: params.id },
      update: {
        content: body.content,
        studentFeedback: body.studentFeedback,
        tajweedScore: body.tajweedScore ? parseInt(body.tajweedScore) : null,
        attendanceStatus: body.attendanceStatus || "PRESENT",
      },
      create: {
        sessionId: params.id,
        content: body.content,
        studentFeedback: body.studentFeedback,
        tajweedScore: body.tajweedScore ? parseInt(body.tajweedScore) : null,
        attendanceStatus: body.attendanceStatus || "PRESENT",
      },
    });

    // Mark session as completed
    await prisma.session.update({
      where: { id: params.id },
      data: { status: "COMPLETED" },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
