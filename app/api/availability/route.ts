import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const slots = await prisma.availability.findMany({
      where: { isActive: true },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    });

    return NextResponse.json({ slots }, {
      headers: { "Cache-Control": "private, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch {
    return NextResponse.json({ slots: [] });
  }
}
