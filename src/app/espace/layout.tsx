import { AppShell } from '@/components/app/shell';
import { requireUser } from '@/lib/auth/guards';
import '../styles/app.css';

export const dynamic = 'force-dynamic';

/** Every page below /espace is signed-in; the actions check again on write. */
export default async function EspaceLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return <AppShell user={user}>{children}</AppShell>;
}
