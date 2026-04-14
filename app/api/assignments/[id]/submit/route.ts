import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { submitAssignmentSchema } from "@/lib/validations/admin";

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = submitAssignmentSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ error: validated.error.errors[0].message }, { status: 400 });
    }

    const assignment = await prisma.assignment.findUnique({
      where: { id: params.id },
    });

    if (!assignment || assignment.studentId !== session.user.id) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    }

    await prisma.assignment.update({
      where: { id: params.id },
      data: {
        status: "SUBMITTED",
        submissionUrl: validated.data.text || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}
