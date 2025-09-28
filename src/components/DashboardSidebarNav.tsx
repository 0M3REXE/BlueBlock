"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface DashboardNavItem { href: string; label: string; }

export function DashboardSidebarNav({ items, title }: { items: DashboardNavItem[]; title?: string }) {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-white/10 bg-[#04252d]/70 backdrop-blur">
      <div className="px-5 pt-6 pb-4 text-sm font-bold tracking-[0.28em] text-white/80">{title || 'BLUEBLOCK'}</div>
      <nav className="flex-1 overflow-y-auto px-3 pb-6 text-[0.7rem] space-y-1">
        <ul className="space-y-1">
          {items.map(item => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block rounded-md px-3 py-2 font-medium transition-colors ${active ? 'bg-white/15 text-white' : 'text-white/65 hover:bg-white/10 hover:text-white'}`}
                >{item.label}</Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="px-4 py-4 text-[0.55rem] text-white/30 border-t border-white/10">© {new Date().getFullYear()} BlueBlock</div>
    </aside>
  );
}
