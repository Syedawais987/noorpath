import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profiles = await prisma.studentProfile.findMany({
      include: {
        user: { select: { name: true, email: true } },
        progressEntries: { orderBy: { date: "desc" }, take: 1 },
      },
    });

    return NextResponse.json({ profiles });
  } catch {
    return NextResponse.json({ profiles: [] });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    await prisma.progressEntry.create({
      data: {
        studentId: body.studentProfileId,
        surahName: body.surahName || null,
        paraNumber: body.paraNumber ? parseInt(body.paraNumber) : null,
        lessonNumber: body.lessonNumber ? parseInt(body.lessonNumber) : null,
        notes: body.notes || null,
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
