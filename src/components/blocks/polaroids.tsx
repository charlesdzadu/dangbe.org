import type { CSSProperties } from 'react';

/* Where each polaroid lands on a closing slab: two at each side, clear of the
 * centred heading. Four spots; a fifth photograph would have nowhere to go. */
const SPOTS: CSSProperties[] = [
  { top: '14%', left: '4%', '--rot': '-7deg', '--w': '150px' } as CSSProperties,
  { top: '54%', left: '9%', '--rot': '5deg', '--w': '160px' } as CSSProperties,
  { top: '12%', right: '5%', '--rot': '4deg', '--w': '150px' } as CSSProperties,
  { top: '52%', right: '10%', '--rot': '-6deg', '--w': '160px' } as CSSProperties,
];

/** The scattered photographs behind a `.cta2` slab (≥ 1100 px only, see CSS). */
export function Polaroids({ srcs }: { srcs: readonly string[] }) {
  return (
    <div className="polaroids" aria-hidden="true">
      {srcs.slice(0, SPOTS.length).map((src, i) => (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img key={src} src={src} alt="" loading="lazy" decoding="async" style={SPOTS[i]} />
      ))}
    </div>
  );
}
