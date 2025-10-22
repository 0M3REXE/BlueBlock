"use client";
import { useEffect, useState } from 'react';
import { Site } from '../types/db';

export default function FieldSiteList({ onSelect }: { onSelect: (site: Site) => void }) {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch('/api/sites');
        if (!res.ok) {
          console.warn('sites API responded', res.status);
          setSites([]);
          return;
        }
        const json = await res.json();
        if (!Array.isArray(json)) {
          setSites([]);
        } else {
          setSites(json || []);
        }
      } catch (e) {
        console.error(e);
        setSites([]);
      } finally { setLoading(false); }
    }
    load();
  }, []);

  return (
    <div>
      <h2 className="text-lg font-semibold">Your Sites</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {loading && <div className="text-xs text-white/50">Loading...</div>}
        {!loading && sites.length === 0 && <div className="text-xs text-white/50">No sites assigned.</div>}
        {sites.map(s => (
          <button key={s.id} onClick={() => onSelect(s)} className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-3 text-left">
            <div className="flex-1">
              <div className="font-medium text-white/90">{s.name}</div>
              <div className="text-[0.75rem] text-white/50">{s.location_name || 'Location unknown'}</div>
            </div>
            <div className="text-xs text-white/40">Open</div>
          </button>
        ))}
      </div>
    </div>
  );
}
