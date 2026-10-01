import type { Metadata } from 'next';
import Link from 'next/link';
import { StatusBadge } from '@/components/app/badge';
import { app } from '@/i18n/app/fr';
import { requireRole } from '@/lib/auth/guards';
import { listCohorts } from '@/lib/queries/cohort-dashboard';
import { formatDate } from '@/lib/utils/dates';

export const metadata: Metadata = { title: app.cohorts.title, robots: { index: false } };

export default async function CohortsPage() {
  const user = await requireRole('ADMIN', 'MENTOR');
  const t = app.cohorts;
  const cohorts = await listCohorts();
  return (
    <div className="page">
      <header className="page__head">
        <div>
          <h1>{t.title}</h1>
          <p className="muted">{t.lede}</p>
        </div>
        {user.role === 'ADMIN' ? (
          <div className="page__actions">
            <Link href="/espace/cohortes/nouvelle" className="btn btn-ink btn-sm">
              {t.new}
            </Link>
          </div>
        ) : null}
      </header>
      {cohorts.length === 0 ? (
        <p className="empty">{t.empty}</p>
      ) : (
        <div className="list">
          {cohorts.map((c) => (
            <Link key={c.id} href={`/espace/cohortes/${c.id}`} className="list__item">
              <div className="list__main">
                <span className="list__title">{c.name}</span>
                <span className="list__sub">
                  {app.labels.pathway[c.pathwayType]} · {t.template} {c.pathwayTemplate.name} · {formatDate(c.startDate)} → {formatDate(c.endDate)}
                </span>
              </div>
              <div className="list__aside">
                <span className="badge badge--muted">
                  {c._count.enrollments} {t.participants}
                </span>
                <StatusBadge kind="cohortStatus" value={c.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
