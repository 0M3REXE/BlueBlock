"use client";

import { useState, useEffect } from 'react';

interface Site {
  id: string;
  name: string;
  location_name: string | null;
  area_hectares: number | null;
  habitat_type: string | null;
}

interface SiteCardProps {
  site: Site;
  onSelect: (siteId: string) => void;
}

function SiteCard({ site, onSelect }: SiteCardProps) {
  return (
    <button
      onClick={() => onSelect(site.id)}
      className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-cyan-400/30 hover:bg-white/10 active:scale-[0.98]"
    >
      <h3 className="text-sm font-semibold text-white sm:text-base">{site.name}</h3>
      {site.location_name && (
        <p className="mt-1 text-xs text-white/50">{site.location_name}</p>
      )}
      <div className="mt-3 flex gap-4 text-xs text-white/60">
        {site.area_hectares && (
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 21h18M6 18v-3m3 3v-6m3 6V9m3 9V6m3 9V3"
              />
            </svg>
            {site.area_hectares} ha
          </span>
        )}
        {site.habitat_type && (
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {site.habitat_type}
          </span>
        )}
      </div>
    </button>
  );
}

interface SiteSelectorProps {
  onSelectSite: (siteId: string) => void;
}

export default function SiteSelector({ onSelectSite }: SiteSelectorProps) {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchAssignedSites() {
      try {
        // In production, this would filter by the current field worker's assignments
        // For now, we fetch all sites from /api/sites
        const res = await fetch('/api/sites');
        if (!res.ok) {
          throw new Error('Failed to fetch sites');
        }
        const data = await res.json();
        setSites(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load sites');
      } finally {
        setLoading(false);
      }
    }

    fetchAssignedSites();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-sm text-white/40">Loading your assigned sites...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-400">
        {error}
      </div>
    );
  }

  if (sites.length === 0) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/5 p-8 text-center">
        <p className="text-sm text-white/60">
          You don&apos;t have any sites assigned yet. Contact your organization administrator.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <h2 className="text-sm font-medium text-white/80">Select a Site to Record Measurements</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sites.map((site) => (
          <SiteCard key={site.id} site={site} onSelect={onSelectSite} />
        ))}
      </div>
    </div>
  );
}
