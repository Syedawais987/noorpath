import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json({
        entries: [],
        attendance: { present: 0, total: 0 },
        feedback: [],
      });
    }

    const [entries, sessionNotes] = await Promise.all([
      prisma.progressEntry.findMany({
        where: { studentId: profile.id },
        orderBy: { date: "desc" },
      }),
      prisma.sessionNote.findMany({
        where: {
          session: { studentId: session.user.id },
        },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          studentFeedback: true,
          tajweedScore: true,
          attendanceStatus: true,
          createdAt: true,
        },
      }),
    ]);

    const present = sessionNotes.filter((n) => n.attendanceStatus === "PRESENT").length;
    const feedback = sessionNotes.filter((n) => n.studentFeedback);

    return NextResponse.json({
      entries,
      attendance: { present, total: sessionNotes.length },
      feedback,
    });
  } catch {
    return NextResponse.json({
      entries: [],
      attendance: { present: 0, total: 0 },
      feedback: [],
    });
  }
}
