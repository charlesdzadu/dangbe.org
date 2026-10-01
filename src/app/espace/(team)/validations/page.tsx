import type { Metadata } from 'next';
import Link from 'next/link';
import { ProofDecision } from '@/components/forms/proof-decision';
import { ExternalLink } from '@/components/icons';
import { app } from '@/i18n/app/fr';
import { requireRole } from '@/lib/auth/guards';
import { pendingProofs } from '@/lib/queries/participant';
import { formatDate } from '@/lib/utils/dates';

export const metadata: Metadata = { title: app.validations.title, robots: { index: false } };

export default async function ValidationsPage({ searchParams }: { searchParams: Promise<{ mine?: string }> }) {
  const user = await requireRole('ADMIN', 'MENTOR');
  const { mine } = await searchParams;
  const t = app.validations;
  const rows = await pendingProofs(mine ? user.id : undefined);
  return (
    <div className="page">
      <header className="page__head">
        <div>
          <h1>{t.title}</h1>
          <p className="muted">{t.lede}</p>
        </div>
      </header>
      <nav className="toolbar" aria-label="Filtres">
        <Link href="/espace/validations" className="chip" data-active={!mine}>
          {t.all}
        </Link>
        <Link href="/espace/validations?mine=1" className="chip" data-active={!!mine}>
          {t.mine}
        </Link>
      </nav>
      {rows.length === 0 ? (
        <p className="empty">{t.empty}</p>
      ) : (
        <div className="list">
          {rows.map((row) => (
            <div key={row.id} className="list__item">
              <div className="list__main">
                <span className="list__title">
                  <Link href={`/espace/participants/${row.enrollment.id}`} className="link-ink">
                    {row.enrollment.user.firstName} {row.enrollment.user.lastName}
                  </Link>{' '}
                  · {row.course.title}
                </span>
                <span className="list__sub">
                  {row.competency.nameFr} · {row.course.provider} · {row.enrollment.cohort.name} · {t.submitted} {row.proofSubmittedAt ? formatDate(row.proofSubmittedAt) : '—'}
                  {row.proofUrl ? (
                    <>
                      {' · '}
                      <a href={row.proofUrl} target="_blank" rel="noopener noreferrer" className="link-ink">
                        {app.participant.openProof} <ExternalLink size={12} />
                      </a>
                    </>
                  ) : null}
                </span>
                <ProofDecision id={row.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
