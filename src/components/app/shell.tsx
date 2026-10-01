import Link from 'next/link';
import { logout } from '@/actions/auth';
import { BrandLockup } from '@/components/brand-lockup';
import { LogOut } from '@/components/icons';
import { app } from '@/i18n/app/fr';
import type { SessionUser } from '@/lib/auth/session';
import { ShellNav, type NavItem } from './shell-nav';

/** The signed-in frame: a side rail on desktop, a top bar with a sheet on phones. */
export function AppShell({ user, children }: { user: SessionUser; children: React.ReactNode }) {
  const t = app.shell;
  const team = user.role === 'ADMIN' || user.role === 'MENTOR';
  const items: NavItem[] = team
    ? [
        { href: '/espace', label: t.dashboard, exact: true },
        { href: '/espace/candidatures', label: t.applications },
        { href: '/espace/cohortes', label: t.cohorts },
        { href: '/espace/validations', label: t.validations },
        ...(user.role === 'ADMIN'
          ? [
              { href: '/espace/parcours', label: t.curriculum },
              { href: '/espace/utilisateurs', label: t.users },
            ]
          : []),
        { href: '/espace/parametres', label: t.settings },
      ]
    : [
        { href: '/espace/mon-parcours', label: t.myPath },
        { href: '/espace/mes-evaluations', label: t.myEvaluations },
        { href: '/espace/parametres', label: t.settings },
      ];

  return (
    <div className="shell">
      <aside className="shell__rail">
        <div className="shell__brand">
          <Link href="/espace" aria-label={t.brand}>
            <BrandLockup size={44} />
          </Link>
          <span className="shell__space">{t.brand}</span>
        </div>
        <ShellNav items={items} />
        <div className="shell__user">
          <p className="shell__name">
            {user.firstName} {user.lastName}
          </p>
          <p className="shell__role">{t.roles[user.role]}</p>
          <div className="shell__user-actions">
            <Link href="/" className="btn btn-ghost btn-sm">
              {t.backToSite}
            </Link>
            <form action={logout}>
              <button type="submit" className="btn btn-outline btn-sm">
                <LogOut size={16} />
                {t.logout}
              </button>
            </form>
          </div>
        </div>
      </aside>
      <main id="main" className="shell__main">
        {children}
      </main>
    </div>
  );
}
