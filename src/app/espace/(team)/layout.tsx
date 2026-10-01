import { requireRole } from '@/lib/auth/guards';

export default async function TeamLayout({ children }: { children: React.ReactNode }) {
  await requireRole('ADMIN', 'MENTOR');
  return children;
}
