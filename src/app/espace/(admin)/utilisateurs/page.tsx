import type { Metadata } from 'next';
import Link from 'next/link';
import { resendInvitation, setUserStatus } from '@/actions/users';
import { StatusBadge } from '@/components/app/badge';
import { app } from '@/i18n/app/fr';
import { requireRole } from '@/lib/auth/guards';
import { prisma } from '@/lib/db/prisma';
import { formatDate } from '@/lib/utils/dates';

export const metadata: Metadata = { title: app.users.title, robots: { index: false } };

export default async function UsersPage({ searchParams }: { searchParams: Promise<{ invited?: string; groupe?: string }> }) {
  const me = await requireRole('ADMIN');
  const { invited, groupe } = await searchParams;
  const t = app.users;
  const participantsOnly = groupe === 'participants';
  const users = await prisma.user.findMany({
    where: participantsOnly ? { role: 'PARTICIPANT' } : { role: { in: ['ADMIN', 'MENTOR'] } },
    orderBy: [{ role: 'asc' }, { lastName: 'asc' }, { firstName: 'asc' }],
  });

  return (
    <div className="page">
      <header className="page__head">
        <div>
          <h1>{t.title}</h1>
          <p className="muted">{t.lede}</p>
        </div>
        <div className="page__actions">
          <Link href="/espace/utilisateurs/inviter" className="btn btn-ink btn-sm">
            {t.invite}
          </Link>
        </div>
      </header>
      {invited ? <p className="form__success">{t.invited}</p> : null}
      <nav className="toolbar" aria-label="Filtres">
        <Link href="/espace/utilisateurs" className="chip" data-active={!participantsOnly}>
          {t.filters.team}
        </Link>
        <Link href="/espace/utilisateurs?groupe=participants" className="chip" data-active={participantsOnly}>
          {t.filters.participants}
        </Link>
      </nav>
      <div className="list">
        {users.map((u) => (
          <div key={u.id} className="list__item">
            <div className="list__main">
              <span className="list__title">
                {u.firstName} {u.lastName}
                {u.id === me.id ? ` (${t.you})` : ''}
              </span>
              <span className="list__sub">
                {u.email} · {app.labels.role[u.role]} · {u.lastLoginAt ? `${app.common.lastActivity} ${formatDate(u.lastLoginAt)}` : app.labels.userStatus.INVITED}
              </span>
            </div>
            <div className="list__aside">
              <StatusBadge kind="userStatus" value={u.status} />
              {u.status === 'INVITED' ? (
                <form action={resendInvitation}>
                  <input type="hidden" name="userId" value={u.id} />
                  <button type="submit" className="btn btn-outline btn-sm">
                    {t.resend}
                  </button>
                </form>
              ) : null}
              {u.id !== me.id ? (
                <form action={setUserStatus}>
                  <input type="hidden" name="userId" value={u.id} />
                  <input type="hidden" name="status" value={u.status === 'DISABLED' ? 'ACTIVE' : 'DISABLED'} />
                  <button type="submit" className="btn btn-ghost btn-sm">
                    {u.status === 'DISABLED' ? t.enable : t.disable}
                  </button>
                </form>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
