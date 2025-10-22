"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Item { href: string; label: string; allowedRoles?: string[] }
export function ClientSidebarNav({ items, role }: { items: Item[]; role: string | null }) {
  const pathname = usePathname();
  const filtered = items.filter(i => !i.allowedRoles || (role && i.allowedRoles.includes(role)));
  return (
    <div className="space-y-2 md:space-y-3">
      <div className="flex items-center gap-2 px-1 text-[0.55rem] uppercase tracking-wide text-white/40 md:text-[0.6rem]">
        <span>Role:</span>
        <span className="inline-block rounded bg-white/10 px-2 py-0.5 text-white/70 md:py-1">{role || 'none'}</span>
      </div>
      <ul className="flex flex-wrap gap-1 md:flex-col md:space-y-1">
      {filtered.map(item => {
        const active = pathname === item.href || pathname.startsWith(item.href + '/');
        return (
          <li key={item.href} className="flex-shrink-0">
            <Link
              href={item.href}
              className={`block whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs transition hover:bg-white/10 hover:text-white md:px-3 md:py-2 md:text-[0.75rem] ${active ? 'bg-white/10 font-medium text-white' : 'text-white/70'}`}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
      {filtered.length === 0 && (
        <div className="px-2 text-[0.6rem] text-white/40">No accessible sections.</div>
      )}
      </ul>
    </div>
  );
}
