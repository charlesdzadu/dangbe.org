'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Scroll-triggered entrance. Renders children immediately (SEO-safe, works
 * without JS since the CSS only hides once JS has attached `html.js`), then
 * flips `data-in` the first time the element enters the viewport.
 */
export function Reveal({
  children,
  delay = 0,
  className = '',
  as: Tag = 'div',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: 'div' | 'section' | 'li' | 'figure' | 'h2' | 'p';
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={`reveal ${className}`}
      data-in={inView}
      style={{ '--d': `${delay}s` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
