import type { Metadata } from 'next';
import { app } from '@/i18n/app/fr';
import { requireRole } from '@/lib/auth/guards';
import { prisma } from '@/lib/db/prisma';
import { formatDate } from '@/lib/utils/dates';

export const metadata: Metadata = { title: app.myEvaluations.title, robots: { index: false } };

export default async function MyEvaluationsPage() {
  const user = await requireRole('PARTICIPANT');
  const t = app.myEvaluations;
  const enrollment = await prisma.enrollment.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      evaluations: { include: { competency: { select: { id: true, nameFr: true, sortOrder: true } } }, orderBy: { evaluatedAt: 'desc' } },
      notes: { where: { visibleToParticipant: true }, include: { author: { select: { firstName: true } } }, orderBy: { createdAt: 'desc' } },
    },
  });
  const latest = new Map<string, NonNullable<typeof enrollment>['evaluations'][number]>();
  for (const ev of enrollment?.evaluations ?? []) if (!latest.has(ev.competencyId)) latest.set(ev.competencyId, ev);
  const rows = [...latest.values()].sort((a, b) => a.competency.sortOrder - b.competency.sortOrder);

  return (
    <div className="page">
      <header className="page__head">
        <div>
          <h1>{t.title}</h1>
          <p className="muted">{t.lede}</p>
        </div>
      </header>
      {rows.length === 0 ? (
        <p className="empty">{t.empty}</p>
      ) : (
        <div className="list">
          {rows.map((ev) => (
            <div key={ev.id} className="list__item">
              <div className="list__main">
                <span className="list__title">{ev.competency.nameFr}</span>
                <span className="list__sub">
                  {t.latest} {formatDate(ev.evaluatedAt)}
                  {ev.notes ? ` · ${ev.notes}` : ''}
                </span>
              </div>
              <div className="list__aside">
                <span className="badge badge--ink">{ev.score}/5</span>
              </div>
            </div>
          ))}
        </div>
      )}
      <section className="panel">
        <h2>{t.notes}</h2>
        {!enrollment || enrollment.notes.length === 0 ? <p className="muted">{t.noNotes}</p> : null}
        <ul className="log">
          {enrollment?.notes.map((n) => (
            <li key={n.id}>
              <time dateTime={n.createdAt.toISOString()}>{formatDate(n.createdAt)}</time>
              <span>
                <strong>{n.author.firstName}</strong>
                <br />
                <span className="prose">{n.body}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
