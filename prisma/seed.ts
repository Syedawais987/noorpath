import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Seed Alma's teacher account
  const passwordHash = await bcrypt.hash("AlmaTeacher2024!", 12);

  const alma = await prisma.user.upsert({
    where: { email: "alma@noorpath.com" },
    update: {},
    create: {
      email: "alma@noorpath.com",
      name: "Alma E Deen",
      passwordHash,
      role: "TEACHER",
      phone: "+923001234567",
      timezone: "Asia/Karachi",
      preferredLanguage: "en",
      whatsappOptedIn: true,
    },
  });

  console.log(`Seeded teacher account: ${alma.email} (${alma.id})`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
