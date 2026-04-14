import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
    const { status, adminMessage } = body;

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        { error: "Status must be APPROVED or REJECTED" },
        { status: 400 },
      );
    }

    const enrollment = await prisma.enrollmentRequest.findUnique({
      where: { id: params.id },
      include: { user: true },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "Enrollment not found" },
        { status: 404 },
      );
    }

    await prisma.enrollmentRequest.update({
      where: { id: params.id },
      data: {
        status,
        adminMessage: adminMessage || null,
      },
    });

    // TODO: Send email notification to student (Phase 7)
    console.log(
      `[DEV] Enrollment ${status.toLowerCase()} email would be sent to ${enrollment.user.email}`,
    );

    return NextResponse.json({ message: `Enrollment ${status.toLowerCase()} successfully` });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
