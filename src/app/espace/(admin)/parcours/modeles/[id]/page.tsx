import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { addTemplateItem, moveTemplateItem, removeTemplateItem } from '@/actions/curriculum';
import { TemplateForm } from '@/components/forms/curriculum-forms';
import { app } from '@/i18n/app/fr';
import { prisma } from '@/lib/db/prisma';

export const metadata: Metadata = { title: app.curriculum.templates, robots: { index: false } };

export default async function EditTemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [m, competencies, courses] = await Promise.all([
    prisma.pathwayTemplate.findUnique({
      where: { id },
      include: { items: { orderBy: { sortOrder: 'asc' }, include: { competency: { select: { nameFr: true } }, course: { select: { title: true, provider: true, estimatedHours: true } } } } },
    }),
    prisma.competency.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' }, select: { id: true, nameFr: true } }),
    prisma.courseResource.findMany({ where: { isActive: true }, orderBy: [{ provider: 'asc' }, { title: 'asc' }], select: { id: true, title: true, provider: true } }),
  ]);
  if (!m) notFound();
  const t = app.curriculum.template;
  const hours = m.items.reduce((s, i) => s + i.course.estimatedHours, 0);

  return (
    <div className="page">
      <nav className="crumbs crumbs--app" aria-label="Breadcrumb">
        <Link href="/espace/parcours/modeles">{app.curriculum.templates}</Link>
        <span aria-hidden="true"> · </span>
        <span aria-current="page">{m.name}</span>
      </nav>
      <header className="page__head">
        <div>
          <h1>{m.name}</h1>
          <p className="muted">
            {app.labels.pathway[m.type]} · {m.targetWeeks} sem. · {m.items.length} {app.curriculum.items} · {hours} {app.curriculum.hours}
          </p>
        </div>
      </header>

      <div className="grid-2up grid-2up--wide">
        <section className="panel">
          <h2>{t.itemsTitle}</h2>
          {m.items.length === 0 ? <p className="muted">{t.empty}</p> : null}
          <div className="list">
            {m.items.map((item, i) => (
              <div key={item.id} className="list__item">
                <div className="list__main">
                  <span className="list__title">
                    {String(i + 1).padStart(2, '0')} · {item.course.title}
                  </span>
                  <span className="list__sub">
                    {item.competency.nameFr} · {item.course.provider} · {item.course.estimatedHours} {app.curriculum.hours} · {item.isRequired ? t.required : t.optional}
                  </span>
                </div>
                <div className="list__aside">
                  <form action={moveTemplateItem}>
                    <input type="hidden" name="itemId" value={item.id} />
                    <button type="submit" name="direction" value="up" className="btn btn-ghost btn-sm" aria-label={t.up} disabled={i === 0}>
                      ↑
                    </button>
                    <button type="submit" name="direction" value="down" className="btn btn-ghost btn-sm" aria-label={t.down} disabled={i === m.items.length - 1}>
                      ↓
                    </button>
                  </form>
                  <form action={removeTemplateItem}>
                    <input type="hidden" name="itemId" value={item.id} />
                    <button type="submit" className="btn btn-outline btn-sm">
                      {t.remove}
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>

          <form action={addTemplateItem} className="form">
            <input type="hidden" name="templateId" value={m.id} />
            <p className="panel__title">{t.addItem}</p>
            <div className="form__row">
              <div className="field">
                <label htmlFor="competencyId" className="field__label">
                  {app.participant.competency}
                </label>
                <select id="competencyId" name="competencyId" className="field__input field__select" required>
                  <option value="">—</option>
                  {competencies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nameFr}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="courseId" className="field__label">
                  {app.curriculum.courses}
                </label>
                <select id="courseId" name="courseId" className="field__input field__select" required>
                  <option value="">—</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.provider} · {c.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <label className="field__check">
              <input type="checkbox" name="isRequired" defaultChecked />
              <span>{t.required}</span>
            </label>
            <div className="form__actions">
              <button type="submit" className="btn btn-ink btn-sm">
                {t.addItem}
              </button>
            </div>
          </form>
        </section>

        <section className="panel">
          <h2>{app.common.edit}</h2>
          <TemplateForm initial={{ id: m.id, name: m.name, type: m.type, targetWeeks: m.targetWeeks, descriptionFr: m.descriptionFr ?? '', isDefault: m.isDefault, isActive: m.isActive }} />
        </section>
      </div>
    </div>
  );
}
