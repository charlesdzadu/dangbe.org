import type { MilestoneStatus } from '@/lib/milestones';

export type TimelineItem = {
  key: string;
  status: MilestoneStatus;
  title: string;
  body: string;
  /** « depuis septembre 2026 », already formatted. */
  since?: string;
};

/**
 * The milestones as a vertical list. The connector is a 2 px Brique line that
 * starts at the first dot and runs past the last item to the slab's edge:
 * the continuity motif, and the one place the python appears on the page.
 * Status is text as well as colour, so it reads without either.
 */
export function Timeline({
  items,
  statusLabels,
}: {
  items: readonly TimelineItem[];
  statusLabels: Record<MilestoneStatus, string>;
}) {
  return (
    <ol className="timeline">
      {items.map((item, i) => (
        <li key={item.key} className="timeline__item" data-status={item.status}>
          <span className="timeline__dot" aria-hidden="true" />
          <div className="timeline__head">
            <span className="timeline__idx">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="timeline__title">{item.title}</h3>
            <span className="timeline__status">{statusLabels[item.status]}</span>
            {item.since ? <span className="timeline__since">{item.since}</span> : null}
          </div>
          <p className="timeline__body">{item.body}</p>
        </li>
      ))}
    </ol>
  );
}
