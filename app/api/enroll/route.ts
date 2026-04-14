import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { enrollmentSchema } from "@/lib/validations/enrollment";
import { sendEmail, enrollmentConfirmationEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (!rateLimit(`enroll:${ip}`, 3, 3600000)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const validated = enrollmentSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors[0].message },
        { status: 400 },
      );
    }

    const data = validated.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      // Check if they already have a pending enrollment
      const existingEnrollment = await prisma.enrollmentRequest.findUnique({
        where: { userId: existingUser.id },
      });

      if (existingEnrollment) {
        return NextResponse.json(
          { error: "Unable to process this enrollment request. Please contact us if you need help." },
          { status: 409 },
        );
      }

      // Existing user without enrollment — create enrollment + profile
      await prisma.$transaction([
        prisma.studentProfile.upsert({
          where: { userId: existingUser.id },
          update: {
            age: data.age,
            learningGoal: data.learningGoal,
            currentLevel: data.currentLevel,
          },
          create: {
            userId: existingUser.id,
            age: data.age,
            learningGoal: data.learningGoal,
            currentLevel: data.currentLevel,
          },
        }),
        prisma.enrollmentRequest.create({
          data: {
            userId: existingUser.id,
            relationship: data.relationship,
            location: data.location,
            preferredSchedule: JSON.stringify(data.preferredSchedule),
          },
        }),
      ]);

      return NextResponse.json(
        { message: "Enrollment submitted successfully" },
        { status: 201 },
      );
    }

    // New user — create user + profile + enrollment in a transaction
    const tempPassword = await bcrypt.hash(
      Math.random().toString(36).slice(-12),
      12,
    );

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: data.email,
          name: data.name,
          phone: data.phone || null,
          timezone: data.timezone,
          passwordHash: tempPassword,
          role: data.relationship === "my_child" ? "PARENT" : "STUDENT",
        },
      });

      await tx.studentProfile.create({
        data: {
          userId: user.id,
          age: data.age,
          learningGoal: data.learningGoal,
          currentLevel: data.currentLevel,
        },
      });

      await tx.enrollmentRequest.create({
        data: {
          userId: user.id,
          relationship: data.relationship,
          location: data.location,
          preferredSchedule: JSON.stringify(data.preferredSchedule),
        },
      });
    });

    // Send confirmation email
    const emailContent = enrollmentConfirmationEmail(data.name);
    await sendEmail({ to: data.email, ...emailContent });

    return NextResponse.json(
      { message: "Enrollment submitted successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Enrollment error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
