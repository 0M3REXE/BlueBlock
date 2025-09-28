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
    <div className="flex h-screen w-full bg-[#031c22] text-white">
      <aside className="hidden md:flex w-56 shrink-0 flex-col border-r border-white/10 bg-[#04252d]">
        <div className="px-4 py-4 text-sm font-bold tracking-wider text-white/80">BLUEBLOCK</div>
        <nav className="flex-1 overflow-y-auto px-2 pb-4 text-[0.75rem]">
          <ClientSidebarNav items={navItems} role={role} />
          <RoleSwitcher current={role} />
        </nav>
        <div className="p-3 border-t border-white/10">
          <WalletButton className="w-full justify-center" />
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex items-center gap-4 border-b border-white/10 bg-[#04252d]/80 px-4 py-2 backdrop-blur md:hidden">
          <div className="text-xs font-semibold tracking-wide">BLUEBLOCK DASHBOARD</div>
          <div className="ml-auto"><WalletButton /></div>
        </header>
        <main className="flex-1 overflow-y-auto px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
