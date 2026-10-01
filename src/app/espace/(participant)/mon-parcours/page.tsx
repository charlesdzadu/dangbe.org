import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import { StatusBadge } from '@/components/app/badge';
import { ProgressForm } from '@/components/forms/progress-form';
import { ExternalLink } from '@/components/icons';
import { app } from '@/i18n/app/fr';
import { requireRole } from '@/lib/auth/guards';
import { computeProgress } from '@/lib/progress';
import { groupByCompetency, myEnrollment } from '@/lib/queries/participant';
import { formatDate } from '@/lib/utils/dates';

export const metadata: Metadata = { title: app.myPath.title, robots: { index: false } };

export default async function MyPathPage() {
  const user = await requireRole('PARTICIPANT');
  const t = app.myPath;
  const e = await myEnrollment(user.id);
  if (!e) {
    return (
      <div className="page">
        <header className="page__head">
          <h1>{t.title}</h1>
        </header>
        <p className="empty">{t.noEnrollment}</p>
      </div>
    );
  }
  const summary = computeProgress(e.progress);
  const groups = groupByCompetency(e.progress);
  const editable = e.status === 'ACTIVE';

  return (
    <div className="page">
      <header className="page__head">
        <div>
          <h1>{e.cohort.name}</h1>
          <p className="muted">
            {t.yourMentor} : {e.mentor ? `${e.mentor.firstName} ${e.mentor.lastName}` : t.noMentor} · {t.endsOn} {formatDate(e.cohort.endDate)}
          </p>
        </div>
        <div className="page__actions">
          <StatusBadge kind="enrollmentStatus" value={e.status} />
        </div>
      </header>

      <section className="panel panel--sand">
        <p>{t.intro}</p>
        <div className="bar" aria-label={`${summary.pct} %`}>
          <span style={{ '--pct': `${summary.pct}%` } as CSSProperties} />
        </div>
        <p className="muted">
          {t.summary.replace('{validated}', String(summary.validated)).replace('{declared}', String(summary.declared)).replace('{required}', String(summary.required))}
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
                    {row.course.provider} · {app.participant.languageOf[row.course.language]} · {row.course.estimatedHours} {app.participant.hours} ·{' '}
                    {row.course.hasCertificate ? (row.course.certificateIsFree ? app.participant.certFree : app.participant.certPaid) : app.participant.noCert} ·{' '}
                    <a href={row.course.url} target="_blank" rel="noopener noreferrer" className="link-ink">
                      {t.openCourse} <ExternalLink size={12} />
                    </a>
                  </span>
                  {row.validationStatus === 'VALIDATED' ? (
                    <p className="form__success">{t.locked}</p>
                  ) : (
                    <>
                      {row.validationStatus === 'REJECTED' ? (
                        <p className="form__error">
                          {t.rejected}
                          {row.validationNote}
                        </p>
                      ) : null}
                      {row.validationStatus === 'PENDING' ? <p className="muted">{t.pending}</p> : null}
                      {editable ? <ProgressForm id={row.id} status={row.status} proofUrl={row.proofUrl} /> : null}
                    </>
                  )}
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
    </div>
  );
}
