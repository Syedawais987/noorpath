import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notify } from "@/lib/notify";
import { invoiceCreatedEmail } from "@/lib/email";

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

    const student = await prisma.user.findUnique({ where: { id: body.studentId }, select: { name: true, email: true } });
    if (student) {
      const amountStr = `${body.currency || "PKR"} ${parseFloat(body.amount).toLocaleString()}`;
      const dueDateStr = new Date(body.dueDate).toLocaleDateString();
      const emailContent = invoiceCreatedEmail(student.name, amountStr, dueDateStr);
      await notify({
        userId: body.studentId,
        type: "invoice_created",
        message: `New invoice: ${amountStr} due ${dueDateStr}`,
        email: { to: student.email, ...emailContent },
        whatsapp: { to: "", templateName: "invoice_created", variables: [student.name, amountStr, dueDateStr] },
      });
    }

    return NextResponse.json({ invoice }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
