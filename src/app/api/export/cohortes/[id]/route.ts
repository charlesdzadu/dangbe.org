import { getCurrentUser } from '@/lib/auth/session';
import { cohortDashboard } from '@/lib/queries/cohort-dashboard';
import { formatDate } from '@/lib/utils/dates';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const cell = (v: string | number | null | undefined) => `"${String(v ?? '').replace(/"/g, '""')}"`;

/** The cohort dashboard as a CSV the volunteers open in Google Sheets. UTF-8 with BOM so Excel keeps the accents. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || user.role === 'PARTICIPANT') return new Response('Unauthorized', { status: 401 });
  const { id } = await params;
  const data = await cohortDashboard(id);
  if (!data) return new Response('Not found', { status: 404 });

  const header = ['Prénom', 'Nom', 'E-mail', 'Statut', 'Mentor', 'Cours requis', 'Déclarés', 'Validés', '% validé', 'Preuves en attente', 'Dernière activité', 'Inactif'];
  const lines = data.rows.map(({ enrollment: e, summary, inactive }) =>
    [
      e.user.firstName,
      e.user.lastName,
      e.user.email,
      e.status,
      e.mentor ? `${e.mentor.firstName} ${e.mentor.lastName}` : '',
      summary.required,
      summary.declared,
      summary.validated,
      summary.pct,
      summary.pending,
      e.lastActivityAt ? formatDate(e.lastActivityAt) : '',
      inactive ? 'oui' : 'non',
    ]
      .map(cell)
      .join(';'),
  );
  const body = '﻿' + [header.map(cell).join(';'), ...lines].join('\r\n');
  return new Response(body, {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="cohorte-${data.cohort.slug}.csv"`,
    },
  });
}
