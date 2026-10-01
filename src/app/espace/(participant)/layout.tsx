import { requireRole } from '@/lib/auth/guards';

export default async function ParticipantLayout({ children }: { children: React.ReactNode }) {
  await requireRole('PARTICIPANT');
  return children;
}
