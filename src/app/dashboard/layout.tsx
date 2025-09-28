import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import WalletButton from '../../components/WalletButton';

export const metadata = { title: 'BlueBlock Dashboard' };

const navItems = [
  { href: '/dashboard/org', label: 'Organization' },
  { href: '/dashboard/projects', label: 'Projects' },
  { href: '/dashboard/sites', label: 'Sites' },
  { href: '/dashboard/verifier', label: 'Verifications' },
  { href: '/dashboard/anchors', label: 'Anchors' },
];

function SidebarNav() {
  const pathname = usePathname();
  return (
    <ul className="space-y-1">
      {navItems.map(item => {
        const active = pathname === item.href || pathname.startsWith(item.href + '/');
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              className={
                `block rounded-md px-3 py-2 transition text-white/70 hover:bg-white/10 hover:text-white ${active ? 'bg-white/10 text-white font-medium' : ''}`
              }
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-full bg-[#031c22] text-white">
      <aside className="hidden md:flex w-56 shrink-0 flex-col border-r border-white/10 bg-[#04252d]">
        <div className="px-4 py-4 text-sm font-bold tracking-wider text-white/80">BLUEBLOCK</div>
        <nav className="flex-1 overflow-y-auto px-2 pb-4 text-[0.75rem]">
          <SidebarNav />
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
