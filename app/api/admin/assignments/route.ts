import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notify } from "@/lib/notify";
import { assignmentPostedEmail } from "@/lib/email";

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

    return NextResponse.json({ assignments });
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

    const assignment = await prisma.assignment.create({
      data: {
        teacherId: session.user.id,
        studentId: body.studentId,
        title: body.title,
        description: body.description || null,
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
      },
    });

    const student = await prisma.user.findUnique({ where: { id: body.studentId }, select: { name: true, email: true } });
    if (student) {
      const emailContent = assignmentPostedEmail(student.name, body.title);
      await notify({
        userId: body.studentId,
        type: "assignment_posted",
        message: `New assignment: ${body.title}`,
        email: { to: student.email, ...emailContent },
        whatsapp: { to: "", templateName: "assignment_posted", variables: [student.name, body.title] },
      });
    }

    return NextResponse.json({ assignment }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
