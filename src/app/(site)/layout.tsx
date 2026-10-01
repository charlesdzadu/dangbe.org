import { Footer } from '@/components/landing/footer';
import { Nav } from '@/components/landing/nav';

/** The marketing shell: the floating bar, the page, the footer slab. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      {children}
      <Footer />
    </>
  );
}
