const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
  try {
    const company = await prisma.company.findFirst();
    if (!company) {
      console.log("No company found. Please run seed first.");
      return;
    }

    const email = "admin@btp.com";
    const password = "password123";
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        password: hashedPassword,
        companyId: company.id
      },
      create: {
        email,
        password: hashedPassword,
        role: "ADMIN",
        companyId: company.id
      }
    });

    console.log("User created/updated successfully:");
    console.log("Email:", user.email);
    console.log("Password: password123");
  } catch (error) {
    console.error("Error creating user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
