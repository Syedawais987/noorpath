import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createProgressSchema } from "@/lib/validations/admin";

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

    return NextResponse.json({ profiles }, {
      headers: { "Cache-Control": "private, s-maxage=30, stale-while-revalidate=60" },
    });
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
    const validated = createProgressSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ error: validated.error.errors[0].message }, { status: 400 });
    }

    await prisma.progressEntry.create({
      data: {
        studentId: validated.data.studentProfileId,
        surahName: validated.data.surahName || null,
        paraNumber: validated.data.paraNumber || null,
        lessonNumber: validated.data.lessonNumber || null,
        notes: validated.data.notes || null,
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
