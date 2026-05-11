const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  try {
    const users = await prisma.user.count();
    const companies = await prisma.company.count();
    const projects = await prisma.project.count();
    const employees = await prisma.employee.count();
    const equipment = await prisma.equipment.count();
    
    console.log("Database Stats:");
    console.log("- Users:", users);
    console.log("- Companies:", companies);
    console.log("- Projects:", projects);
    console.log("- Employees:", employees);
    console.log("- Equipment:", equipment);
  } catch (error) {
    console.error("Error checking users:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
