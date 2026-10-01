import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { StatusBadge } from '@/components/app/badge';
import { DecisionForm } from '@/components/forms/decision-form';
import { ReviewForm } from '@/components/forms/review-form';
import { app } from '@/i18n/app/fr';
import { requireRole } from '@/lib/auth/guards';
import { prisma } from '@/lib/db/prisma';
import { teamMembers } from '@/lib/queries/cohort-dashboard';
import { formatDate, formatDateTime } from '@/lib/utils/dates';

export const metadata: Metadata = { title: app.applications.detailTitle, robots: { index: false } };

export default async function ApplicationPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireRole('ADMIN', 'MENTOR');
  const { id } = await params;
  const t = app.applications;
  const a = await prisma.application.findUnique({
    where: { id },
    include: {
      reviews: { include: { reviewer: { select: { id: true, firstName: true, lastName: true } } }, orderBy: { createdAt: 'asc' } },
      decidedBy: { select: { firstName: true, lastName: true } },
      user: { select: { id: true, enrollments: { select: { id: true, cohort: { select: { name: true } } }, orderBy: { createdAt: 'desc' }, take: 1 } } },
      activity: { orderBy: { createdAt: 'desc' }, take: 20 },
    },
  });
  if (!a) notFound();

  const decidable = ['SUBMITTED', 'UNDER_REVIEW', 'WAITLISTED'].includes(a.status);
  const mine = a.reviews.find((r) => r.reviewerId === user.id);
  const [cohorts, mentors] = decidable && user.role === 'ADMIN'
    ? await Promise.all([
        prisma.cohort.findMany({ where: { status: { in: ['PLANNED', 'ACTIVE'] } }, orderBy: { startDate: 'desc' }, select: { id: true, name: true, pathwayType: true } }),
        teamMembers(),
      ])
    : [[], []];
  const enrollment = a.user?.enrollments[0];

  return (
    <div className="page">
      <nav className="crumbs crumbs--app" aria-label="Breadcrumb">
        <Link href="/espace/candidatures">{t.title}</Link>
        <span aria-hidden="true"> · </span>
        <span aria-current="page">
          {a.firstName} {a.lastName}
        </span>
      </nav>
      <header className="page__head">
        <div>
          <h1>
            {a.firstName} {a.lastName}
          </h1>
          <p className="muted">
            {t.received} {formatDateTime(a.createdAt)} · {a.city}
          </p>
        </div>
        <div className="page__actions">
          <StatusBadge kind="applicationStatus" value={a.status} />
          {enrollment ? (
            <Link href={`/espace/participants/${enrollment.id}`} className="btn btn-outline btn-sm">
              {enrollment.cohort.name}
            </Link>
          ) : null}
        </div>
      </header>

      <div className="grid-2up grid-2up--wide">
        <div className="page">
          <section className="panel">
            <h2>{t.sections.identity}</h2>
            <dl className="kv">
              <div>
                <dt>{t.fields.email}</dt>
                <dd>
                  <a href={`mailto:${a.email}`}>{a.email}</a>
                </dd>
              </div>
              <div>
                <dt>{t.fields.phone}</dt>
                <dd>
                  <a href={`tel:${a.phone.replace(/\s/g, '')}`}>{a.phone}</a>
                </dd>
              </div>
              <div>
                <dt>{t.fields.city}</dt>
                <dd>{a.city}</dd>
              </div>
              <div>
                <dt>{t.fields.locale}</dt>
                <dd>{app.labels.locale[a.locale]}</dd>
              </div>
            </dl>
          </section>

          <section className="panel">
            <h2>{t.sections.background}</h2>
            <dl className="kv">
              <div>
                <dt>{t.fields.degree}</dt>
                <dd>{app.labels.degree[a.degreeLevel]}</dd>
              </div>
              <div>
                <dt>{t.fields.year}</dt>
                <dd>{a.graduationYear}</dd>
              </div>
              <div>
                <dt>{t.fields.field}</dt>
                <dd>{a.fieldOfStudy}</dd>
              </div>
              <div>
                <dt>{t.fields.institution}</dt>
                <dd>{a.institution}</dd>
              </div>
            </dl>
          </section>

          <section className="panel">
            <h2>{t.sections.fit}</h2>
            <dl className="kv">
              <div>
                <dt>{t.fields.device}</dt>
                <dd>{app.labels.device[a.deviceAccess]}</dd>
              </div>
              <div>
                <dt>{t.fields.internet}</dt>
                <dd>{app.labels.internet[a.internetAccess]}</dd>
              </div>
              <div>
                <dt>{t.fields.hours}</dt>
                <dd>{a.hoursPerWeek}</dd>
              </div>
              <div>
                <dt>{t.fields.pathway}</dt>
                <dd>{a.pathwayPreference ? app.labels.pathway[a.pathwayPreference] : '—'}</dd>
              </div>
              <div>
                <dt>{t.fields.french}</dt>
                <dd>{app.labels.language[a.frenchLevel]}</dd>
              </div>
              <div>
                <dt>{t.fields.english}</dt>
                <dd>{app.labels.language[a.englishLevel]}</dd>
              </div>
              <div>
                <dt>{t.fields.feedback}</dt>
                <dd>{a.feedbackWilling ? app.common.yes : app.common.no}</dd>
              </div>
              <div>
                <dt>{t.fields.howHeard}</dt>
                <dd>{a.howHeard ?? '—'}</dd>
              </div>
            </dl>
          </section>

          <section className="panel">
            <h2>{t.sections.motivation}</h2>
            <p className="prose">{a.motivation}</p>
          </section>
        </div>

        <div className="page">
          <section className="panel">
            <h2>{t.sections.reviews}</h2>
            {a.reviews.length === 0 ? <p className="muted">{app.common.none}</p> : null}
            {a.reviews.map((r) => (
              <div key={r.id} className="kv">
                <div className="kv--wide">
                  <dt>
                    {r.reviewer.firstName} {r.reviewer.lastName} · {formatDate(r.updatedAt)}
                  </dt>
                  <dd>
                    {t.review.motivation} {r.motivationScore}/5 · {t.review.access} {r.accessScore}/5 · {t.review.feedback} {r.feedbackScore}/5
                    {r.comment ? <p className="muted">{r.comment}</p> : null}
                  </dd>
                </div>
              </div>
            ))}
            {decidable ? (
              <ReviewForm
                applicationId={a.id}
                initial={mine ? { motivationScore: mine.motivationScore, accessScore: mine.accessScore, feedbackScore: mine.feedbackScore, comment: mine.comment ?? '' } : undefined}
              />
            ) : null}
          </section>

          <section className="panel panel--sand">
            <h2>{t.sections.decision}</h2>
            {decidable ? (
              user.role === 'ADMIN' ? (
                <DecisionForm applicationId={a.id} cohorts={cohorts} mentors={mentors} />
              ) : (
                <p className="muted">{t.decision.title}</p>
              )
            ) : (
              <dl className="kv">
                <div>
                  <dt>{t.decision.decidedBy}</dt>
                  <dd>
                    {a.decidedBy ? `${a.decidedBy.firstName} ${a.decidedBy.lastName}` : '—'}
                    {a.decidedAt ? ` · ${formatDate(a.decidedAt)}` : ''}
                  </dd>
                </div>
                {a.decisionNotes ? (
                  <div className="kv--wide">
                    <dt>{t.decision.notes}</dt>
                    <dd className="prose">{a.decisionNotes}</dd>
                  </div>
                ) : null}
              </dl>
            )}
          </section>

          <section className="panel">
            <h2>{t.sections.activity}</h2>
            <ul className="log">
              {a.activity.map((e) => (
                <li key={e.id}>
                  <time dateTime={e.createdAt.toISOString()}>{formatDateTime(e.createdAt)}</time>
                  <span>{app.labels.activity[e.type]}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
