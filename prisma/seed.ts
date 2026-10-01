import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { COMPETENCIES, COURSES, TEMPLATES } from './seed-data';

/**
 * Idempotent: every row is upserted by slug or email, so the seed can run on
 * a fresh database and again on a filled one. SEED_DEMO=1 adds a mentor, a
 * participant with materialised progress and two applications (dev only).
 */
const prisma = new PrismaClient();

async function main() {
  // ---- curriculum ---------------------------------------------------------
  const competencyIds = new Map<string, string>();
  for (const [i, c] of COMPETENCIES.entries()) {
    const row = await prisma.competency.upsert({
      where: { slug: c.slug },
      update: { nameFr: c.nameFr, nameEn: c.nameEn, descriptionFr: c.descriptionFr, sortOrder: i },
      create: { slug: c.slug, nameFr: c.nameFr, nameEn: c.nameEn, descriptionFr: c.descriptionFr, sortOrder: i },
    });
    competencyIds.set(c.slug, row.id);
  }

  const courseIds = new Map<string, string>();
  for (const course of COURSES) {
    const { competencies, ...data } = course;
    const row = await prisma.courseResource.upsert({
      where: { slug: course.slug },
      update: data,
      create: data,
    });
    courseIds.set(course.slug, row.id);
    await prisma.competencyCourse.deleteMany({ where: { courseId: row.id } });
    await prisma.competencyCourse.createMany({
      data: competencies.map((slug, i) => ({
        courseId: row.id,
        competencyId: mustGet(competencyIds, slug),
        sortOrder: i,
      })),
    });
  }

  const templateIds = new Map<string, string>();
  for (const template of TEMPLATES) {
    const { items, ...data } = template;
    const row = await prisma.pathwayTemplate.upsert({
      where: { slug: template.slug },
      update: { ...data, isDefault: true },
      create: { ...data, isDefault: true },
    });
    templateIds.set(template.slug, row.id);
    await prisma.pathwayTemplateItem.deleteMany({ where: { templateId: row.id } });
    await prisma.pathwayTemplateItem.createMany({
      data: items.map(([competencySlug, courseSlug], i) => ({
        templateId: row.id,
        competencyId: mustGet(competencyIds, competencySlug),
        courseId: mustGet(courseIds, courseSlug),
        sortOrder: i,
        isRequired: true,
      })),
    });
  }

  // ---- the pilot cohort ---------------------------------------------------
  const cohort = await prisma.cohort.upsert({
    where: { slug: 'pilote-2026' },
    update: {},
    create: {
      slug: 'pilote-2026',
      name: 'Cohorte pilote 2026',
      pathwayType: 'SHORT',
      pathwayTemplateId: mustGet(templateIds, 'parcours-court'),
      startDate: new Date('2026-11-02T00:00:00Z'),
      endDate: new Date('2027-01-31T00:00:00Z'),
      status: 'PLANNED',
      description: 'La première promotion : suivi rapproché, retours attendus sur chaque cours.',
    },
  });

  console.log(
    `Seeded ${competencyIds.size} competencies, ${courseIds.size} courses, ${templateIds.size} templates, cohort "${cohort.name}".`,
  );

  if (process.env.SEED_DEMO === '1') await seedDemo(cohort.id, mustGet(templateIds, 'parcours-court'));
}

async function seedDemo(cohortId: string, templateId: string) {
  const mentor = await prisma.user.upsert({
    where: { email: 'mentor@dangbe.test' },
    update: {},
    create: {
      email: 'mentor@dangbe.test',
      passwordHash: await bcrypt.hash('dangbe-mentor-2026', 12),
      firstName: 'Ama',
      lastName: 'Mentor',
      role: 'MENTOR',
      status: 'ACTIVE',
    },
  });

  const participant = await prisma.user.upsert({
    where: { email: 'participant@dangbe.test' },
    update: {},
    create: {
      email: 'participant@dangbe.test',
      passwordHash: await bcrypt.hash('dangbe-participant-2026', 12),
      firstName: 'Kossi',
      lastName: 'Participant',
      role: 'PARTICIPANT',
      status: 'ACTIVE',
    },
  });

  const twentyDaysAgo = new Date(Date.now() - 20 * 24 * 60 * 60 * 1000);
  const enrollment = await prisma.enrollment.upsert({
    where: { userId_cohortId: { userId: participant.id, cohortId } },
    update: {},
    create: { userId: participant.id, cohortId, mentorId: mentor.id, status: 'ACTIVE', lastActivityAt: twentyDaysAgo },
  });

  const items = await prisma.pathwayTemplateItem.findMany({ where: { templateId }, orderBy: { sortOrder: 'asc' } });
  await prisma.courseProgress.deleteMany({ where: { enrollmentId: enrollment.id } });
  await prisma.courseProgress.createMany({
    data: items.map((item, i) => ({
      enrollmentId: enrollment.id,
      courseId: item.courseId,
      competencyId: item.competencyId,
      isRequired: item.isRequired,
      sortOrder: item.sortOrder,
      ...(i === 0
        ? {
            status: 'COMPLETED' as const,
            completedAt: twentyDaysAgo,
            proofType: 'LINK' as const,
            proofUrl: 'https://example.com/certificat-1',
            proofSubmittedAt: twentyDaysAgo,
            validationStatus: 'VALIDATED' as const,
            validatedById: mentor.id,
            validatedAt: twentyDaysAgo,
          }
        : i === 1
          ? {
              status: 'COMPLETED' as const,
              completedAt: twentyDaysAgo,
              proofType: 'LINK' as const,
              proofUrl: 'https://example.com/certificat-2',
              proofSubmittedAt: twentyDaysAgo,
              validationStatus: 'PENDING' as const,
            }
          : i === 2
            ? { status: 'IN_PROGRESS' as const, startedAt: twentyDaysAgo }
            : {}),
    })),
  });

  const applications = [
    { firstName: 'Afi', lastName: 'Demo', email: 'afi@dangbe.test', status: 'SUBMITTED' as const },
    { firstName: 'Yao', lastName: 'Demo', email: 'yao@dangbe.test', status: 'UNDER_REVIEW' as const },
  ];
  for (const a of applications) {
    const existing = await prisma.application.findFirst({ where: { email: a.email } });
    if (existing) continue;
    const created = await prisma.application.create({
      data: {
        ...a,
        phone: '+22890000000',
        city: 'Lomé',
        degreeLevel: 'LICENCE',
        fieldOfStudy: 'Gestion',
        institution: 'Université de Lomé',
        graduationYear: 2025,
        motivation:
          'Je veux être prêt pour un premier poste dans une entreprise internationale. J’ai suivi une licence de gestion et je manque de pratique sur les outils numériques et la communication professionnelle. Je suis disponible chaque soir et prêt à donner mon avis sur le programme.',
        deviceAccess: 'SMARTPHONE_ONLY',
        internetAccess: 'MOBILE_DATA',
        hoursPerWeek: 8,
        pathwayPreference: 'SHORT',
        feedbackWilling: true,
        frenchLevel: 'NATIVE',
        englishLevel: 'B1',
        consentAt: new Date(),
      },
    });
    if (a.status === 'UNDER_REVIEW') {
      await prisma.applicationReview.create({
        data: {
          applicationId: created.id,
          reviewerId: mentor.id,
          motivationScore: 4,
          accessScore: 3,
          feedbackScore: 5,
          comment: 'Motivation claire, accès limité mais réaliste.',
        },
      });
    }
  }

  console.log('Demo data: mentor@dangbe.test / participant@dangbe.test (passwords in prisma/seed.ts).');
}

function mustGet<K, V>(map: Map<K, V>, key: K): V {
  const value = map.get(key);
  if (value === undefined) throw new Error(`Seed: unknown key ${String(key)}`);
  return value;
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
