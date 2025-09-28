import { ReactNode } from 'react';
import WalletButton from '../../components/WalletButton';
import Link from 'next/link';

export const metadata = { title: 'Organization Dashboard - BlueBlock' };

const nav = [
  { href: '/organization-dashboard', label: 'Overview' },
  { href: '/organization-dashboard/sites', label: 'Sites' },
];

export default function OrgDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-[#031c22] text-white">
      <aside className="hidden md:flex w-52 shrink-0 flex-col border-r border-white/10 bg-[#04252d]">
        <div className="px-4 py-4 text-sm font-bold tracking-wider text-white/80">BLUEBLOCK</div>
        <nav className="flex-1 overflow-y-auto px-2 pb-6 text-[0.7rem] space-y-1">
          {nav.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-md px-3 py-2 font-medium text-white/70 hover:bg-white/10 hover:text-white transition"
            >{item.label}</Link>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10">
          <WalletButton className="w-full justify-center" />
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex items-center gap-4 border-b border-white/10 bg-[#04252d]/80 px-4 py-2 backdrop-blur md:hidden">
          <div className="text-xs font-semibold tracking-wide">ORG DASHBOARD</div>
          <div className="ml-auto"><WalletButton /></div>
        </header>
        <main className="flex-1 overflow-y-auto px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
