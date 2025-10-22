import { ReactNode } from 'react';
import { cookies } from 'next/headers';
import WalletButton from '../../components/WalletButton';
import { ClientSidebarNav } from '../../components/ClientSidebarNav';
import { RoleSwitcher } from '../../components/RoleSwitcher';

export const metadata = { title: 'BlueBlock Dashboard' };

const navItems = [
  { href: '/dashboard/org', label: 'Organization', allowedRoles: ['org'] },
  { href: '/dashboard/projects', label: 'Projects', allowedRoles: ['org'] },
  { href: '/dashboard/sites', label: 'Sites', allowedRoles: ['org','field'] },
  { href: '/dashboard/field', label: 'Field Entry', allowedRoles: ['field'] },
  { href: '/dashboard/verifier', label: 'Verifications', allowedRoles: ['verifier'] },
  { href: '/dashboard/anchors', label: 'Anchors', allowedRoles: ['org'] },
];

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const role = cookieStore.get('bb_role')?.value ?? null;
  return (
    <div className="flex h-screen w-full flex-col bg-[#031c22] text-white md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-white/10 bg-[#04252d] md:flex">
        <div className="px-4 py-4 text-sm font-bold tracking-wider text-white/80">BLUEBLOCK</div>
        <nav className="flex-1 overflow-y-auto px-2 pb-4 text-[0.75rem]">
          <ClientSidebarNav items={navItems} role={role} />
          <RoleSwitcher current={role} />
        </nav>
        <div className="border-t border-white/10 p-3">
          <WalletButton className="w-full justify-center" />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="flex items-center justify-between gap-4 border-b border-white/10 bg-[#04252d]/80 px-4 py-3 backdrop-blur md:hidden">
          <div className="text-xs font-semibold tracking-wide">BLUEBLOCK DASHBOARD</div>
          <WalletButton className="text-xs" />
        </header>

        {/* Mobile Navigation */}
        <div className="border-b border-white/10 bg-[#04252d]/60 px-2 py-2 md:hidden">
          <div className="overflow-x-auto">
            <ClientSidebarNav items={navItems} role={role} />
          </div>
          <div className="mt-2">
            <RoleSwitcher current={role} />
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">{children}</main>
      </div>
    </div>
  );
}
