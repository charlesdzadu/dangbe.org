import bcrypt from 'bcryptjs';

const COST = 12;

/* A real hash of a random string: `verifyPassword` runs against it when the
 * user does not exist, so the response time does not reveal which emails
 * have an account. */
const DUMMY_HASH = '$2a$12$C6UzMDM.H6dfI/f/IKcEeO5Gk1O8i8x8Zk0m8qkq6h2f2mKk1n6tS';

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, COST);
}

export async function verifyPassword(password: string, hash: string | null | undefined): Promise<boolean> {
  const ok = await bcrypt.compare(password, hash ?? DUMMY_HASH);
  return hash ? ok : false;
}
