import { NextResponse } from "next/server";
import crypto from "crypto";
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

    if (status === "APPROVED") {
      // Generate a password reset token so the student can set their password
      await prisma.passwordResetToken.deleteMany({
        where: { email: enrollment.user.email },
      });

      const token = crypto.randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      await prisma.passwordResetToken.create({
        data: {
          email: enrollment.user.email,
          token,
          expires,
        },
      });

      const setPasswordUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

      // TODO: Send "set your password" email via Resend (Phase 7)
      console.log(
        `[DEV] Enrollment approved — "Set your password" link for ${enrollment.user.email}: ${setPasswordUrl}`,
      );
    } else {
      // TODO: Send rejection email via Resend (Phase 7)
      console.log(
        `[DEV] Enrollment rejected email would be sent to ${enrollment.user.email}`,
      );
    }

    return NextResponse.json({ message: `Enrollment ${status.toLowerCase()} successfully` });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
