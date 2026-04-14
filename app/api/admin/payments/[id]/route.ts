import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notify } from "@/lib/notify";
import { sendEmail } from "@/lib/email";
import { generateReceiptHTML } from "@/lib/receipt";

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
    const paidAt = body.status === "PAID" ? new Date() : null;

    const invoice = await prisma.invoice.update({
      where: { id: params.id },
      data: {
        status: body.status,
        paidAt,
        paymentMethod: body.paymentMethod || "Manual",
      },
      include: { student: { select: { id: true, name: true, email: true } } },
    });

    if (body.status === "PAID" && paidAt) {
      const receiptHtml = generateReceiptHTML({
        invoiceId: invoice.id,
        studentName: invoice.student.name,
        amount: invoice.amount,
        currency: invoice.currency,
        paidAt,
        paymentMethod: invoice.paymentMethod,
      });

      await sendEmail({
        to: invoice.student.email,
        subject: `Payment Receipt — ${invoice.currency} ${invoice.amount.toLocaleString()} — NoorPath`,
        html: receiptHtml,
      });

      await notify({
        userId: invoice.student.id,
        type: "payment_received",
        message: `Payment of ${invoice.currency} ${invoice.amount.toLocaleString()} received. Thank you!`,
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
