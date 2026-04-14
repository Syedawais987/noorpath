import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { resetPasswordSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, ...passwordData } = body;

    if (!token) {
      return NextResponse.json({ error: "Invalid reset token" }, { status: 400 });
    }

    const validated = resetPasswordSchema.safeParse(passwordData);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors[0].message },
        { status: 400 },
      );
    }

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken || resetToken.expires < new Date()) {
      return NextResponse.json(
        { error: "This reset link has expired. Please request a new one." },
        { status: 400 },
      );
    }

    const passwordHash = await bcrypt.hash(validated.data.password, 12);

    await prisma.user.update({
      where: { email: resetToken.email },
      data: { passwordHash },
    });

    await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });

    return NextResponse.json({ message: "Password reset successfully" });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
