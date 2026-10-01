import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { CSSProperties } from 'react';
import { StatusBadge } from '@/components/app/badge';
import { app } from '@/i18n/app/fr';
import { requireRole } from '@/lib/auth/guards';
import { cohortDashboard } from '@/lib/queries/cohort-dashboard';
import { daysAgo, formatDate } from '@/lib/utils/dates';

export const metadata: Metadata = { title: app.cohorts.title, robots: { index: false } };

export default async function CohortPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireRole('ADMIN', 'MENTOR');
  const { id } = await params;
  const data = await cohortDashboard(id);
  if (!data) notFound();
  const { cohort, rows } = data;
  const t = app.cohorts;

  return (
    <div className="page">
      <nav className="crumbs crumbs--app" aria-label="Breadcrumb">
        <Link href="/espace/cohortes">{t.title}</Link>
        <span aria-hidden="true"> · </span>
        <span aria-current="page">{cohort.name}</span>
      </nav>
      <header className="page__head">
        <div>
          <h1>{cohort.name}</h1>
          <p className="muted">
            {app.labels.pathway[cohort.pathwayType]} · {t.template} {cohort.pathwayTemplate.name} ({cohort.pathwayTemplate.items.length}) · {formatDate(cohort.startDate)} → {formatDate(cohort.endDate)}
          </p>
        </div>
        <div className="page__actions">
          <StatusBadge kind="cohortStatus" value={cohort.status} />
          <a href={`/api/export/cohortes/${cohort.id}`} className="btn btn-outline btn-sm">
            {t.dashboard.exportCsv}
          </a>
          {user.role === 'ADMIN' ? (
            <Link href={`/espace/cohortes/${cohort.id}/modifier`} className="btn btn-outline btn-sm">
              {app.common.edit}
            </Link>
          ) : null}
        </div>
      </header>

      {cohort.description ? <p className="muted">{cohort.description}</p> : null}

      {rows.length === 0 ? (
        <p className="empty">{t.dashboard.empty}</p>
      ) : (
        <div className="list">
          {rows.map(({ enrollment: e, summary, inactive }) => {
            const days = daysAgo(e.lastActivityAt);
            return (
              <Link key={e.id} href={`/espace/participants/${e.id}`} className="list__item">
                <div className="list__main">
                  <span className="list__title">
                    {e.user.firstName} {e.user.lastName}
                  </span>
                  <span className="list__sub">
                    {t.dashboard.mentor} : {e.mentor ? `${e.mentor.firstName} ${e.mentor.lastName}` : t.dashboard.noMentor} · {app.common.lastActivity} :{' '}
                    {days === null ? app.common.never : days === 0 ? app.common.today : app.common.daysAgo.replace('{n}', String(days))}
                  </span>
                  <div className="bar" aria-label={`${summary.pct} %`}>
                    <span style={{ '--pct': `${summary.pct}%` } as CSSProperties} />
                  </div>
                  <span className="list__sub">
                    {t.dashboard.progress} : {summary.validated}/{summary.required} · {summary.declared}/{summary.required}
                  </span>
                </div>
                <div className="list__aside">
                  {summary.pending > 0 ? (
                    <span className="badge badge--warn">
                      {summary.pending} {t.dashboard.pending}
                    </span>
                  ) : null}
                  {inactive ? <span className="badge badge--danger">{t.dashboard.inactive}</span> : null}
                  {e.user.status === 'INVITED' ? <StatusBadge kind="userStatus" value="INVITED" /> : null}
                  <StatusBadge kind="enrollmentStatus" value={e.status} />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
