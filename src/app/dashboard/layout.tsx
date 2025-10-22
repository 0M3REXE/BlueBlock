import { ReactNode } from 'react';
import Navbar from '../../components/Navbar';
import { NAV_LINKS } from '../../components/navLinks';

export const metadata = { title: 'BlueBlock Dashboard' };

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <main className="relative min-h-dvh overflow-hidden text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[#021b23]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_35%,#07343f_0%,#021b23_55%,#01161d_100%)] opacity-[0.55]" />
      </div>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-4 sm:px-6 sm:pt-6 md:px-8 lg:px-12 xl:px-14">
        <Navbar links={NAV_LINKS} />
        <div className="py-8 sm:py-10 md:py-12">
          {children}
        </div>
      </section>
    </main>
  );
}
