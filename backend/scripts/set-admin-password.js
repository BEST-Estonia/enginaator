require('dotenv').config();

const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const newPassword = process.env.NEW_ADMIN_PASSWORD;

  if (!adminEmail) {
    throw new Error('ADMIN_EMAIL is required');
  }

  if (!newPassword) {
    throw new Error('NEW_ADMIN_PASSWORD is required');
  }

  if (newPassword.length < 10) {
    throw new Error('NEW_ADMIN_PASSWORD must be at least 10 characters');
  }

  const user = await prisma.adminUser.findUnique({ where: { email: adminEmail } });

  if (!user) {
    throw new Error(`Admin user not found for email: ${adminEmail}`);
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  await prisma.adminUser.update({
    where: { email: adminEmail },
    data: { passwordHash },
  });

  console.log(`✅ Admin password updated for ${adminEmail}`);
}

main()
  .catch((error) => {
    console.error('❌ Failed to update admin password:', error.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
