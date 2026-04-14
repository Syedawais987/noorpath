import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createDailyRoom } from "@/lib/daily";
import { generateICS } from "@/lib/ics";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    const classSession = await prisma.session.findUnique({
      where: { id: params.id },
      include: {
        student: { select: { name: true, email: true } },
        teacher: { select: { name: true } },
      },
    });

    if (!classSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // CONFIRM — teacher only
    if (action === "confirm") {
      if (session.user.role !== "TEACHER") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Create Daily.co room
      const dailyRoomUrl = await createDailyRoom(params.id);

      await prisma.session.update({
        where: { id: params.id },
        data: { dailyRoomUrl },
      });

      // Generate .ics
      const icsContent = generateICS({
        title: "Quran Class — NoorPath",
        description: `Session with ${classSession.teacher.name}`,
        startTime: classSession.startTime,
        endTime: classSession.endTime,
        url: dailyRoomUrl,
      });

      // TODO: Email .ics to student via Resend (Phase 7)
      console.log(`[DEV] Calendar invite for ${classSession.student.email}:`);
      console.log(icsContent.substring(0, 200) + "...");

      return NextResponse.json({ message: "Session confirmed", dailyRoomUrl });
    }

    // CANCEL — either teacher or student (with 12h policy for students)
    if (action === "cancel") {
      const hoursUntilSession =
        (classSession.startTime.getTime() - Date.now()) / (1000 * 60 * 60);

      // Students must cancel 12+ hours before
      if (session.user.role !== "TEACHER" && hoursUntilSession < 12) {
        return NextResponse.json(
          { error: "Cannot cancel within 12 hours of session. Please contact your teacher." },
          { status: 400 },
        );
      }

      await prisma.session.update({
        where: { id: params.id },
        data: { status: "CANCELLED" },
      });

      return NextResponse.json({ message: "Session cancelled" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
