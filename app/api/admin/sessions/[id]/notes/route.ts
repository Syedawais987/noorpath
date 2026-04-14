import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sessionNoteSchema } from "@/lib/validations/admin";

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
    const validated = sessionNoteSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ error: validated.error.errors[0].message }, { status: 400 });
    }

    await prisma.sessionNote.upsert({
      where: { sessionId: params.id },
      update: {
        content: validated.data.content || null,
        studentFeedback: validated.data.studentFeedback || null,
        tajweedScore: validated.data.tajweedScore || null,
        attendanceStatus: validated.data.attendanceStatus,
      },
      create: {
        sessionId: params.id,
        content: validated.data.content || null,
        studentFeedback: validated.data.studentFeedback || null,
        tajweedScore: validated.data.tajweedScore || null,
        attendanceStatus: validated.data.attendanceStatus,
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
