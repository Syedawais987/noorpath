import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notify } from "@/lib/notify";
import { assignmentPostedEmail } from "@/lib/email";
import { createAssignmentSchema } from "@/lib/validations/admin";

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const assignments = await prisma.assignment.findMany({
      include: { student: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ assignments }, {
      headers: { "Cache-Control": "private, s-maxage=30, stale-while-revalidate=60" },
    });
  } catch {
    return NextResponse.json({ assignments: [] });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = createAssignmentSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ error: validated.error.errors[0].message }, { status: 400 });
    }

    const assignment = await prisma.assignment.create({
      data: {
        teacherId: session.user.id,
        studentId: validated.data.studentId,
        title: validated.data.title,
        description: validated.data.description || null,
        dueDate: validated.data.dueDate ? new Date(validated.data.dueDate) : null,
      },
    });

    const student = await prisma.user.findUnique({ where: { id: validated.data.studentId }, select: { name: true, email: true } });
    if (student) {
      const emailContent = assignmentPostedEmail(student.name, body.title);
      await notify({
        userId: validated.data.studentId,
        type: "assignment_posted",
        message: `New assignment: ${validated.data.title}`,
        email: { to: student.email, ...emailContent },
        whatsapp: { to: "", templateName: "assignment_posted", variables: [student.name, validated.data.title] },
      });
    }

    return NextResponse.json({ assignment }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
