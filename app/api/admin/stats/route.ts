import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart.getTime() + 86400000);

    const [totalStudents, pendingEnrollments, sessionsToday, totalSessions] =
      await Promise.all([
        prisma.user.count({ where: { role: { in: ["STUDENT", "PARENT"] } } }),
        prisma.enrollmentRequest.count({ where: { status: "PENDING" } }),
        prisma.session.count({
          where: { startTime: { gte: todayStart, lt: todayEnd } },
        }),
        prisma.session.count(),
      ]);

    return NextResponse.json({
      totalStudents,
      pendingEnrollments,
      sessionsToday,
      totalSessions,
    }, {
      headers: { "Cache-Control": "private, s-maxage=10, stale-while-revalidate=30" },
    });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
