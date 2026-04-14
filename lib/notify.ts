import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { sendWhatsApp } from "@/lib/whatsapp";

interface NotifyOptions {
  userId: string;
  type: string;
  message: string;
  email?: { to: string; subject: string; html: string };
  whatsapp?: { to: string; templateName: string; variables: string[] };
}

export async function notify({ userId, type, message, email, whatsapp }: NotifyOptions) {
  // 1. In-app notification
  await prisma.notification.create({
    data: { userId, type, message },
  });

  // 2. Email (if provided)
  if (email) {
    await sendEmail(email);
  }

  // 3. WhatsApp (if provided and user opted in)
  if (whatsapp) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { whatsappOptedIn: true, phone: true },
    });

    if (user?.whatsappOptedIn && user.phone) {
      await sendWhatsApp({
        to: whatsapp.to || user.phone,
        templateName: whatsapp.templateName,
        variables: whatsapp.variables,
      });
    }
  }
}
