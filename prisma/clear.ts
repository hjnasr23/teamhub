import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.subscription.deleteMany();
  await prisma.post.deleteMany();
  await prisma.club.deleteMany();
  await prisma.user.deleteMany();
  console.log("PostgreSQL database tables successfully cleared!");
}

main()
  .catch((e) => {
    console.error("Error clearing database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
