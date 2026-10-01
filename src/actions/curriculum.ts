'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { parseForm, type ActionResult } from '@/lib/action-result';
import { requireRole } from '@/lib/auth/guards';
import { prisma } from '@/lib/db/prisma';
import { slugify } from '@/lib/utils/slug';
import { competencySchema, courseSchema, templateItemRefSchema, templateItemSchema, templateSchema } from '@/lib/validation/curriculum';

/* Nothing here is ever hard-deleted: `isActive=false` archives, and the
 * Restrict foreign keys protect the rows a running cohort still points at. */

async function uniqueSlug(table: 'competency' | 'courseResource' | 'pathwayTemplate', base: string): Promise<string> {
  const root = slugify(base) || table;
  for (let n = 1; ; n++) {
    const slug = n === 1 ? root : `${root}-${n}`;
    const clash =
      table === 'competency'
        ? await prisma.competency.findUnique({ where: { slug }, select: { id: true } })
        : table === 'courseResource'
          ? await prisma.courseResource.findUnique({ where: { slug }, select: { id: true } })
          : await prisma.pathwayTemplate.findUnique({ where: { slug }, select: { id: true } });
    if (!clash) return slug;
  }
}

function revalidateCurriculum() {
  revalidatePath('/espace/parcours');
  revalidatePath('/espace/parcours/competences');
  revalidatePath('/espace/parcours/cours');
  revalidatePath('/espace/parcours/modeles');
}

export async function saveCompetency(_prev: ActionResult | undefined, formData: FormData): Promise<ActionResult> {
  await requireRole('ADMIN');
  const parsed = parseForm(competencySchema, formData);
  if (!parsed.ok) return { ok: false, fieldErrors: parsed.fieldErrors };
  const { id, ...d } = parsed.data;
  const data = { ...d, descriptionFr: d.descriptionFr ?? null, descriptionEn: d.descriptionEn ?? null };
  if (id) await prisma.competency.update({ where: { id }, data });
  else await prisma.competency.create({ data: { ...data, slug: await uniqueSlug('competency', d.nameFr) } });
  revalidateCurriculum();
  redirect('/espace/parcours/competences');
}

export async function saveCourse(_prev: ActionResult | undefined, formData: FormData): Promise<ActionResult> {
  await requireRole('ADMIN');
  const parsed = parseForm(courseSchema, formData);
  if (!parsed.ok) return { ok: false, fieldErrors: parsed.fieldErrors };
  const { id, competencyIds, ...d } = parsed.data;
  const data = { ...d, description: d.description ?? null };
  await prisma.$transaction(async (tx) => {
    const row = id
      ? await tx.courseResource.update({ where: { id }, data })
      : await tx.courseResource.create({ data: { ...data, slug: await uniqueSlug('courseResource', d.title) } });
    await tx.competencyCourse.deleteMany({ where: { courseId: row.id } });
    if (competencyIds.length > 0) {
      await tx.competencyCourse.createMany({ data: competencyIds.map((competencyId, i) => ({ courseId: row.id, competencyId, sortOrder: i })) });
    }
  });
  revalidateCurriculum();
  redirect('/espace/parcours/cours');
}

export async function saveTemplate(_prev: ActionResult | undefined, formData: FormData): Promise<ActionResult> {
  await requireRole('ADMIN');
  const parsed = parseForm(templateSchema, formData);
  if (!parsed.ok) return { ok: false, fieldErrors: parsed.fieldErrors };
  const { id, ...d } = parsed.data;
  const data = { ...d, descriptionFr: d.descriptionFr ?? null };
  const row = await prisma.$transaction(async (tx) => {
    const saved = id
      ? await tx.pathwayTemplate.update({ where: { id }, data })
      : await tx.pathwayTemplate.create({ data: { ...data, slug: await uniqueSlug('pathwayTemplate', d.name) } });
    /* One default per type. */
    if (d.isDefault) await tx.pathwayTemplate.updateMany({ where: { type: d.type, NOT: { id: saved.id } }, data: { isDefault: false } });
    return saved;
  });
  revalidateCurriculum();
  redirect(`/espace/parcours/modeles/${row.id}`);
}

export async function addTemplateItem(formData: FormData): Promise<void> {
  await requireRole('ADMIN');
  const parsed = parseForm(templateItemSchema, formData);
  if (!parsed.ok) return;
  const d = parsed.data;
  const exists = await prisma.pathwayTemplateItem.findUnique({ where: { templateId_courseId: { templateId: d.templateId, courseId: d.courseId } } });
  if (exists) return;
  const last = await prisma.pathwayTemplateItem.findFirst({ where: { templateId: d.templateId }, orderBy: { sortOrder: 'desc' } });
  await prisma.pathwayTemplateItem.create({
    data: { templateId: d.templateId, competencyId: d.competencyId, courseId: d.courseId, isRequired: d.isRequired, sortOrder: (last?.sortOrder ?? -1) + 1 },
  });
  revalidatePath(`/espace/parcours/modeles/${d.templateId}`);
}

export async function removeTemplateItem(formData: FormData): Promise<void> {
  await requireRole('ADMIN');
  const parsed = parseForm(templateItemRefSchema, formData);
  if (!parsed.ok) return;
  const item = await prisma.pathwayTemplateItem.findUnique({ where: { id: parsed.data.itemId } });
  if (!item) return;
  await prisma.pathwayTemplateItem.delete({ where: { id: item.id } });
  revalidatePath(`/espace/parcours/modeles/${item.templateId}`);
}

export async function moveTemplateItem(formData: FormData): Promise<void> {
  await requireRole('ADMIN');
  const parsed = parseForm(templateItemRefSchema, formData);
  if (!parsed.ok || !parsed.data.direction) return;
  const item = await prisma.pathwayTemplateItem.findUnique({ where: { id: parsed.data.itemId } });
  if (!item) return;
  const items = await prisma.pathwayTemplateItem.findMany({ where: { templateId: item.templateId }, orderBy: { sortOrder: 'asc' } });
  const index = items.findIndex((i) => i.id === item.id);
  const target = parsed.data.direction === 'up' ? index - 1 : index + 1;
  const other = items[target];
  if (!other) return;
  await prisma.$transaction([
    prisma.pathwayTemplateItem.update({ where: { id: item.id }, data: { sortOrder: target } }),
    prisma.pathwayTemplateItem.update({ where: { id: other.id }, data: { sortOrder: index } }),
  ]);
  revalidatePath(`/espace/parcours/modeles/${item.templateId}`);
}
