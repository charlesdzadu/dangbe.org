import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { TeamDashboard } from '@/components/app/team-dashboard';
import { app } from '@/i18n/app/fr';
import { requireUser } from '@/lib/auth/guards';

export const metadata: Metadata = { title: app.shell.dashboard, robots: { index: false, follow: false } };

/** The role decides the landing: the team gets the dashboard, a participant their pathway. */
export default async function EspaceHome() {
  const user = await requireUser();
  if (user.role === 'PARTICIPANT') redirect('/espace/mon-parcours');
  return <TeamDashboard user={user} />;
}
