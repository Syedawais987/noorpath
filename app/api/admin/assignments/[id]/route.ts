import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notify } from "@/lib/notify";
import { assignmentFeedbackEmail } from "@/lib/email";
import { reviewAssignmentSchema } from "@/lib/validations/admin";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = reviewAssignmentSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ error: validated.error.errors[0].message }, { status: 400 });
    }

    const assignment = await prisma.assignment.update({
      where: { id: params.id },
      data: {
        status: validated.data.status,
        feedback: validated.data.feedback || null,
      },
      include: { student: { select: { name: true, email: true } } },
    });

    const emailContent = assignmentFeedbackEmail(assignment.student.name, assignment.title, validated.data.status);
    await notify({
      userId: assignment.studentId,
      type: "assignment_feedback",
      message: `Your assignment "${assignment.title}" has been ${validated.data.status.toLowerCase()}.`,
      email: { to: assignment.student.email, ...emailContent },
      whatsapp: { to: "", templateName: "assignment_feedback", variables: [assignment.student.name, assignment.title] },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
