'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X } from '@/components/icons';
import { app } from '@/i18n/app/fr';

export type NavItem = { href: string; label: string; exact?: boolean };

export function ShellNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);
  const active = (item: NavItem) => (item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`));

  return (
    <nav className="shell__nav" aria-label={app.shell.menu} data-open={open}>
      <button
        type="button"
        className="nav-icon-btn shell__burger"
        aria-label={app.shell.menu}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      <ul className="shell__list">
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="shell__link" data-active={active(item)} aria-current={active(item) ? 'page' : undefined}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
