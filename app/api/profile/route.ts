import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        email: true,
        phone: true,
        timezone: true,
        whatsappOptedIn: true,
      },
    });

    return NextResponse.json({ profile: user });
  } catch {
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: body.name,
        phone: body.phone || null,
        timezone: body.timezone,
        whatsappOptedIn: body.whatsappOptedIn === true,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
