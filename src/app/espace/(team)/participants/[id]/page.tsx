import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { CSSProperties } from 'react';
import { assignMentor, setEnrollmentStatus } from '@/actions/cohort';
import { StatusBadge } from '@/components/app/badge';
import { EvaluationForm, NoteForm } from '@/components/forms/participant-forms';
import { ProofDecision } from '@/components/forms/proof-decision';
import { ExternalLink } from '@/components/icons';
import { app } from '@/i18n/app/fr';
import { requireRole } from '@/lib/auth/guards';
import { computeProgress, isInactive } from '@/lib/progress';
import { teamMembers } from '@/lib/queries/cohort-dashboard';
import { groupByCompetency, participantDetail } from '@/lib/queries/participant';
import { ENROLLMENT_STATUSES } from '@/lib/validation/cohort';
import { daysAgo, formatDate, formatDateTime } from '@/lib/utils/dates';

export const metadata: Metadata = { title: app.participant.title, robots: { index: false } };

export default async function ParticipantPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireRole('ADMIN', 'MENTOR');
  const { id } = await params;
  const e = await participantDetail(id);
  if (!e) notFound();
  const t = app.participant;
  const summary = computeProgress(e.progress);
  const groups = groupByCompetency(e.progress);
  const mentors = user.role === 'ADMIN' ? await teamMembers() : [];
  const competencies = groups.map((g) => ({ id: g.competency.id, nameFr: g.competency.nameFr }));
  const days = daysAgo(e.lastActivityAt);
  const inactive = e.status === 'ACTIVE' && isInactive(e.lastActivityAt);

  return (
    <div className="page">
      <nav className="crumbs crumbs--app" aria-label="Breadcrumb">
        <Link href="/espace/cohortes">{app.cohorts.title}</Link>
        <span aria-hidden="true"> · </span>
        <Link href={`/espace/cohortes/${e.cohort.id}`}>{e.cohort.name}</Link>
        <span aria-hidden="true"> · </span>
        <span aria-current="page">
          {e.user.firstName} {e.user.lastName}
        </span>
      </nav>
      <header className="page__head">
        <div>
          <h1>
            {e.user.firstName} {e.user.lastName}
          </h1>
          <p className="muted">
            <a href={`mailto:${e.user.email}`}>{e.user.email}</a>
            {e.user.phone ? ` · ${e.user.phone}` : ''} · {t.mentor} : {e.mentor ? `${e.mentor.firstName} ${e.mentor.lastName}` : app.cohorts.dashboard.noMentor} · {app.common.lastActivity} :{' '}
            {days === null ? app.common.never : days === 0 ? app.common.today : app.common.daysAgo.replace('{n}', String(days))}
          </p>
        </div>
        <div className="page__actions">
          {inactive ? <span className="badge badge--danger">{app.cohorts.dashboard.inactive}</span> : null}
          {e.user.status === 'INVITED' ? <StatusBadge kind="userStatus" value="INVITED" /> : null}
          <StatusBadge kind="enrollmentStatus" value={e.status} />
        </div>
      </header>

      <div className="grid-2up grid-2up--wide">
        <div className="page">
          <section className="panel">
            <h2>{t.progress}</h2>
            <div className="bar" aria-label={`${summary.pct} %`}>
              <span style={{ '--pct': `${summary.pct}%` } as CSSProperties} />
            </div>
            <p className="muted">
              {summary.validated} {t.validated} · {summary.declared} {t.declared} · {summary.required} {t.required}
            </p>
          </section>

          {groups.map((g) => (
            <section key={g.competency.id} className="panel">
              <h2>{g.competency.nameFr}</h2>
              <div className="list">
                {g.rows.map((row) => (
                  <div key={row.id} className="list__item">
                    <div className="list__main">
                      <span className="list__title">
                        {row.course.title}
                        {!row.isRequired ? ` (${app.common.optional.toLowerCase()})` : ''}
                      </span>
                      <span className="list__sub">
                        {row.course.provider} · {t.languageOf[row.course.language]} · {row.course.estimatedHours} {t.hours}
                        {row.proofUrl ? (
                          <>
                            {' · '}
                            <a href={row.proofUrl} target="_blank" rel="noopener noreferrer" className="link-ink">
                              {t.openProof} <ExternalLink size={12} />
                            </a>
                          </>
                        ) : null}
                        {row.validationStatus === 'VALIDATED' && row.validatedBy ? ` · ${t.validatedBy} ${row.validatedBy.firstName} ${row.validatedBy.lastName}` : ''}
                        {row.validationStatus === 'REJECTED' && row.validationNote ? ` · ${row.validationNote}` : ''}
                      </span>
                      {row.validationStatus === 'PENDING' ? <ProofDecision id={row.id} /> : null}
                    </div>
                    <div className="list__aside">
                      <StatusBadge kind="progressStatus" value={row.status} />
                      {row.validationStatus !== 'NONE' ? <StatusBadge kind="validationStatus" value={row.validationStatus} /> : null}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}

          <section className="panel">
            <h2>{t.activity}</h2>
            <ul className="log">
              {e.activity.map((a) => (
                <li key={a.id}>
                  <time dateTime={a.createdAt.toISOString()}>{formatDateTime(a.createdAt)}</time>
                  <span>{app.labels.activity[a.type]}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="page">
          {user.role === 'ADMIN' ? (
            <section className="panel panel--sand">
              <h2>{t.assignMentor}</h2>
              <form action={assignMentor} className="form__inline">
                <input type="hidden" name="enrollmentId" value={e.id} />
                <div className="field">
                  <label htmlFor="mentorId" className="field__label">
                    {t.mentor}
                  </label>
                  <select id="mentorId" name="mentorId" className="field__input field__select" defaultValue={e.mentor?.id ?? ''}>
                    <option value="">{app.common.none}</option>
                    {mentors.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.firstName} {m.lastName} ({app.labels.role[m.role]})
                      </option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="btn btn-ink btn-sm">
                  {app.common.save}
                </button>
              </form>
            </section>
          ) : null}

          <section className="panel">
            <h2>{t.changeStatus}</h2>
            <form action={setEnrollmentStatus} className="form__inline">
              <input type="hidden" name="enrollmentId" value={e.id} />
              <div className="field">
                <label htmlFor="enrollmentStatus" className="field__label">
                  {t.status}
                </label>
                <select id="enrollmentStatus" name="status" className="field__input field__select" defaultValue={e.status}>
                  {ENROLLMENT_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {app.labels.enrollmentStatus[s]}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-outline btn-sm">
                {app.common.save}
              </button>
            </form>
          </section>

          <section className="panel">
            <h2>{t.evaluations}</h2>
            {e.evaluations.length === 0 ? <p className="muted">{app.common.none}</p> : null}
            <ul className="log">
              {e.evaluations.map((ev) => (
                <li key={ev.id}>
                  <time dateTime={ev.evaluatedAt.toISOString()}>{formatDate(ev.evaluatedAt)}</time>
                  <span>
                    <strong>{ev.competency.nameFr}</strong> · {ev.score}/5 · {ev.evaluator.firstName} {ev.evaluator.lastName}
                    {ev.notes ? <span className="muted"> · {ev.notes}</span> : null}
                  </span>
                </li>
              ))}
            </ul>
            <EvaluationForm enrollmentId={e.id} competencies={competencies} />
          </section>

          <section className="panel">
            <h2>{t.notes}</h2>
            {e.notes.length === 0 ? <p className="muted">{app.common.none}</p> : null}
            <ul className="log">
              {e.notes.map((n) => (
                <li key={n.id}>
                  <time dateTime={n.createdAt.toISOString()}>{formatDate(n.createdAt)}</time>
                  <span>
                    <strong>
                      {n.author.firstName} {n.author.lastName}
                    </strong>
                    {n.visibleToParticipant ? <span className="badge badge--muted"> {t.visibleTag}</span> : null}
                    <br />
                    <span className="prose">{n.body}</span>
                  </span>
                </li>
              ))}
            </ul>
            <NoteForm enrollmentId={e.id} />
          </section>
        </div>
      </div>
    </div>
  );
}
