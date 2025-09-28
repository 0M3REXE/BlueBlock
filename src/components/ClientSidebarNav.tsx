"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Item { href: string; label: string; allowedRoles?: string[] }
export function ClientSidebarNav({ items, role }: { items: Item[]; role: string | null }) {
  const pathname = usePathname();
  const filtered = items.filter(i => !i.allowedRoles || (role && i.allowedRoles.includes(role)));
  return (
    <div className="space-y-3">
      <div className="text-[0.6rem] uppercase tracking-wide text-white/40 px-1 flex items-center gap-2">
        <span>Role:</span>
        <span className="inline-block rounded bg-white/10 px-2 py-1 text-white/70">{role || 'none'}</span>
      </div>
      <ul className="space-y-1">
      {filtered.map(item => {
        const active = pathname === item.href || pathname.startsWith(item.href + '/');
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`block rounded-md px-3 py-2 transition text-white/70 hover:bg-white/10 hover:text-white ${active ? 'bg-white/10 text-white font-medium' : ''}`}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
      {filtered.length === 0 && (
        <div className="text-[0.6rem] text-white/40 px-2">No accessible sections.</div>
      )}
      </ul>
    </div>
  );
}
