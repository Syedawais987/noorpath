import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { dayOfWeek, startTime, endTime, timezoneOffset = 0 } = body;

    // Find the teacher (Alma)
    const teacher = await prisma.user.findFirst({
      where: { role: "TEACHER" },
    });

    if (!teacher) {
      return NextResponse.json({ error: "No teacher found" }, { status: 404 });
    }

    // Calculate the next occurrence of this day/time
    const now = new Date();
    const currentDay = now.getUTCDay();
    let daysUntil = dayOfWeek - currentDay;
    if (daysUntil <= 0) daysUntil += 7;

    const sessionDate = new Date(now);
    sessionDate.setUTCDate(sessionDate.getUTCDate() + daysUntil);

    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);

    // Build dates in client's local time, then adjust to UTC
    // timezoneOffset from JS is in minutes, negative for east of UTC
    // e.g. Pakistan (UTC+5) = -300
    const start = new Date(sessionDate);
    start.setUTCHours(startH, startM, 0, 0);
    start.setUTCMinutes(start.getUTCMinutes() + timezoneOffset);

    const end = new Date(sessionDate);
    end.setUTCHours(endH, endM, 0, 0);
    end.setUTCMinutes(end.getUTCMinutes() + timezoneOffset);

    const newSession = await prisma.session.create({
      data: {
        teacherId: teacher.id,
        studentId: session.user.id,
        startTime: start,
        endTime: end,
        status: "SCHEDULED",
      },
    });

    return NextResponse.json({ session: newSession }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to request session" }, { status: 500 });
  }
}
