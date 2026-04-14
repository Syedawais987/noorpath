import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const invoices = await prisma.invoice.findMany({
      where: { studentId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ invoices });
  } catch {
    return NextResponse.json({ invoices: [] });
  }
}
