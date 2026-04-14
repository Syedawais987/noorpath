import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const invoices = await prisma.invoice.findMany({
      include: { student: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ invoices });
  } catch {
    return NextResponse.json({ invoices: [] });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const invoice = await prisma.invoice.create({
      data: {
        studentId: body.studentId,
        amount: parseFloat(body.amount),
        currency: body.currency || "PKR",
        dueDate: new Date(body.dueDate),
      },
    });

    return NextResponse.json({ invoice }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
