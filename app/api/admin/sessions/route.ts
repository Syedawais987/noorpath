import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessions = await prisma.session.findMany({
      include: {
        student: { select: { name: true, email: true } },
        sessionNote: true,
      },
      orderBy: { startTime: "desc" },
    });

    return NextResponse.json({ sessions });
  } catch {
    return NextResponse.json({ sessions: [] });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { studentId, startTime, duration } = body;

    const start = new Date(startTime);
    const end = new Date(start.getTime() + duration * 60000);

    const newSession = await prisma.session.create({
      data: {
        teacherId: session.user.id,
        studentId,
        startTime: start,
        endTime: end,
      },
    });

    return NextResponse.json({ session: newSession }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
