import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateReceiptHTML } from "@/lib/receipt";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const invoice = await prisma.invoice.findUnique({
      where: { id: params.id },
      include: { student: { select: { id: true, name: true } } },
    });

    if (!invoice || (session.user.role !== "TEACHER" && invoice.student.id !== session.user.id)) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (invoice.status !== "PAID" || !invoice.paidAt) {
      return NextResponse.json({ error: "Invoice not paid yet" }, { status: 400 });
    }

    const html = generateReceiptHTML({
      invoiceId: invoice.id,
      studentName: invoice.student.name,
      amount: invoice.amount,
      currency: invoice.currency,
      paidAt: invoice.paidAt,
      paymentMethod: invoice.paymentMethod,
    });

    return new NextResponse(html, {
      headers: { "Content-Type": "text/html" },
    });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
