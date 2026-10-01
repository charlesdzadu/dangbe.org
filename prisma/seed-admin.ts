import { randomBytes } from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

/**
 * Creates (or re-activates) the first ADMIN. `ADMIN_EMAIL` defaults to
 * admin@dangbe.org; `ADMIN_PASSWORD` is used when set, otherwise a password is
 * generated and printed ONCE — copy it, it is not stored anywhere readable.
 *
 *   pnpm db:seed:admin
 */
const prisma = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_EMAIL ?? 'admin@dangbe.org').toLowerCase();
  const generated = !process.env.ADMIN_PASSWORD;
  const password = process.env.ADMIN_PASSWORD || randomBytes(12).toString('base64url');
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role: 'ADMIN', status: 'ACTIVE' },
    create: { email, passwordHash, firstName: 'Admin', lastName: 'DANGBE', role: 'ADMIN', status: 'ACTIVE' },
  });

  console.log(`ADMIN ready: ${email}`);
  if (generated) console.log(`Generated password (shown once): ${password}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
