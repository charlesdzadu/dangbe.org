import Link from 'next/link';
import type { SessionUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';
import { INACTIVE_AFTER_DAYS } from '@/lib/progress';

/** Four counters and the two queues that need a human today. */
export async function TeamDashboard({ user }: { user: SessionUser }) {
  const inactiveBefore = new Date(Date.now() - INACTIVE_AFTER_DAYS * 24 * 60 * 60 * 1000);
  const [toReview, pendingProofs, inactive, activeCohorts] = await Promise.all([
    prisma.application.count({ where: { status: { in: ['SUBMITTED', 'UNDER_REVIEW'] } } }),
    prisma.courseProgress.count({ where: { validationStatus: 'PENDING' } }),
    prisma.enrollment.count({
      where: { status: 'ACTIVE', OR: [{ lastActivityAt: null }, { lastActivityAt: { lt: inactiveBefore } }] },
    }),
    prisma.cohort.count({ where: { status: 'ACTIVE' } }),
  ]);

  const tiles = [
    { value: toReview, label: 'candidatures à traiter', href: '/espace/candidatures' },
    { value: pendingProofs, label: 'preuves en attente', href: '/espace/validations' },
    { value: inactive, label: `participants inactifs (${INACTIVE_AFTER_DAYS} j)`, href: '/espace/cohortes' },
    { value: activeCohorts, label: 'cohortes actives', href: '/espace/cohortes' },
  ];

  return (
    <div className="page">
      <header className="page__head">
        <h1>Bonjour {user.firstName}</h1>
        <p className="muted">Ce qui attend l’équipe aujourd’hui.</p>
      </header>
      <div className="tiles">
        {tiles.map((tile) => (
          <Link key={tile.label} href={tile.href} className="tile">
            <b className="tile__value">{tile.value}</b>
            <span className="tile__label">{tile.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
