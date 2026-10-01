import Link from 'next/link';
import { BrandLockup } from '@/components/brand-lockup';
import '../styles/app.css';

/** Signed-out shell: one centred card on the Sable ground, the lockup above it. */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth grid-bg">
      <div className="auth__inner">
        <Link href="/" className="auth__logo">
          <BrandLockup size={56} />
        </Link>
        <div className="auth__card">{children}</div>
      </div>
    </div>
  );
}
