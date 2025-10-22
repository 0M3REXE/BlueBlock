"use client";
import { useState, useTransition } from 'react';

const roles = [
  { key: 'org', label: 'Org' },
  { key: 'field', label: 'Field' },
  { key: 'verifier', label: 'Verifier' },
];

export function RoleSwitcher({ current }: { current: string | null }) {
  const [optimistic, setOptimistic] = useState(current);
  const [isPending, startTransition] = useTransition();

  async function setRole(role: string | null) {
    setOptimistic(role);
    if (role) {
      await fetch('/api/set-role', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ role }) });
    } else {
      // Clear cookie by setting expired
      document.cookie = 'bb_role=; Max-Age=0; path=/';
    }
    startTransition(() => {
      window.location.reload();
    });
  }

  return (
    <div className="mt-3 space-y-2 md:mt-4">
      <div className="text-[0.5rem] uppercase tracking-wide text-white/40 md:text-[0.55rem]">Dev Role Toggle</div>
      <div className="flex flex-wrap gap-1.5 md:gap-2">
        <button
          onClick={() => setRole(null)}
          className={`rounded border px-2 py-1 text-[0.55rem] transition md:text-[0.6rem] ${!optimistic ? 'border-white/30 bg-white/20 text-white' : 'border-white/20 text-white/60 hover:bg-white/10'}`}
          disabled={isPending}
        >None</button>
        {roles.map(r => (
          <button
            key={r.key}
            onClick={() => setRole(r.key)}
            className={`rounded border px-2 py-1 text-[0.55rem] transition md:text-[0.6rem] ${optimistic===r.key ? 'border-white/30 bg-white/20 text-white' : 'border-white/20 text-white/60 hover:bg-white/10'}`}
            disabled={isPending}
          >{r.label}</button>
        ))}
      </div>
    </div>
  );
}
