import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const now = new Date();

    const [nextSession, totalSessions, completedSessions, assignments, profile] =
      await Promise.all([
        prisma.session.findFirst({
          where: { studentId: userId, status: "SCHEDULED", startTime: { gte: now } },
          orderBy: { startTime: "asc" },
          include: { teacher: { select: { name: true } } },
        }),
        prisma.session.count({ where: { studentId: userId } }),
        prisma.session.count({
          where: { studentId: userId, status: "COMPLETED" },
        }),
        prisma.assignment.count({
          where: { studentId: userId, status: "PENDING" },
        }),
        prisma.studentProfile.findUnique({
          where: { userId },
          include: { progressEntries: { orderBy: { date: "desc" }, take: 1 } },
        }),
      ]);

    return NextResponse.json({
      nextSession,
      stats: {
        totalSessions,
        completedSessions,
        pendingAssignments: assignments,
        currentSurah: profile?.progressEntries[0]?.surahName || null,
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }
}
