import type { Metadata } from 'next';
import Link from 'next/link';
import type { ApplicationStatus } from '@prisma/client';
import { StatusBadge } from '@/components/app/badge';
import { app } from '@/i18n/app/fr';
import { prisma } from '@/lib/db/prisma';
import { formatDate } from '@/lib/utils/dates';

export const metadata: Metadata = { title: app.applications.title, robots: { index: false } };

const STATUSES: ApplicationStatus[] = ['SUBMITTED', 'UNDER_REVIEW', 'WAITLISTED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'];

function avg(reviews: { motivationScore: number; accessScore: number; feedbackScore: number }[]): string | null {
  if (reviews.length === 0) return null;
  const total = reviews.reduce((s, r) => s + (r.motivationScore + r.accessScore + r.feedbackScore) / 3, 0);
  return (total / reviews.length).toFixed(1);
}

export default async function ApplicationsPage({ searchParams }: { searchParams: Promise<{ statut?: string }> }) {
  const t = app.applications;
  const { statut } = await searchParams;
  const filter = STATUSES.find((s) => s === statut);
  const [rows, counts] = await Promise.all([
    prisma.application.findMany({
      where: filter ? { status: filter } : {},
      orderBy: { createdAt: 'desc' },
      include: { reviews: { select: { motivationScore: true, accessScore: true, feedbackScore: true } } },
    }),
    prisma.application.groupBy({ by: ['status'], _count: { _all: true } }),
  ]);
  const countOf = (s: ApplicationStatus) => counts.find((c) => c.status === s)?._count._all ?? 0;

  return (
    <div className="page">
      <header className="page__head">
        <div>
          <h1>{t.title}</h1>
          <p className="muted">{t.lede}</p>
        </div>
      </header>

      <nav className="toolbar" aria-label="Filtres">
        <Link href="/espace/candidatures" className="chip" data-active={!filter}>
          {t.filterAll}
        </Link>
        {STATUSES.map((s) => (
          <Link key={s} href={`/espace/candidatures?statut=${s}`} className="chip" data-active={filter === s}>
            {app.labels.applicationStatus[s]} · {countOf(s)}
          </Link>
        ))}
      </nav>

      {rows.length === 0 ? (
        <p className="empty">{t.empty}</p>
      ) : (
        <div className="list">
          {rows.map((a) => {
            const score = avg(a.reviews);
            return (
              <Link key={a.id} href={`/espace/candidatures/${a.id}`} className="list__item">
                <div className="list__main">
                  <span className="list__title">
                    {a.firstName} {a.lastName}
                  </span>
                  <span className="list__sub">
                    {a.city} · {app.labels.degree[a.degreeLevel]} · {a.fieldOfStudy} · {t.received} {formatDate(a.createdAt)}
                  </span>
                </div>
                <div className="list__aside">
                  {score ? (
                    <span className="badge badge--muted">
                      {score}/5 · {a.reviews.length} {t.reviews}
                    </span>
                  ) : null}
                  <StatusBadge kind="applicationStatus" value={a.status} />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
