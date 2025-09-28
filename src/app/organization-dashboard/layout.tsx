import { ReactNode } from 'react';
import Navbar from '../../components/Navbar';
import { NAV_LINKS } from '../../components/navLinks';
import { DashboardSidebarNav } from '../../components/DashboardSidebarNav';

export const metadata = { title: 'Organization Dashboard - BlueBlock' };

export default function OrgDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen w-full bg-[#021b23] text-white flex">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[#021b23]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_35%,#07343f_0%,#021b23_55%,#01161d_100%)] opacity-[0.45]" />
      </div>
      <div className="relative z-10 flex w-full flex-col">
        <Navbar links={NAV_LINKS} />
        <div className="flex flex-1">
          <DashboardSidebarNav
            title="ORG" 
            items={[
              { href: '/organization-dashboard', label: 'Overview' },
              { href: '/organization-dashboard/sites', label: 'Sites' },
            ]}
          />
          <main className="flex-1 px-6 pt-10 pb-20 max-w-5xl mx-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}
