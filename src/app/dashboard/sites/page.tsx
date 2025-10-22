"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Modal from '../../../components/Modal';
import SiteForm from '../../../components/SiteForm';

interface Site {
  id: string;
  name: string;
  area_hectares: number | null;
  project_id: string;
}

export default function SitesListPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchSites = async () => {
    try {
      const res = await fetch('/api/sites');
      if (res.ok) {
        const data = await res.json();
        setSites(data || []);
      }
    } catch (err) {
      console.error('Failed to fetch sites:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  const handleSiteCreated = () => {
    setShowCreateModal(false);
    fetchSites();
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-base font-semibold tracking-wide sm:text-lg">Field Sites</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-[#062024] transition hover:bg-cyan-400"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Site
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-white/5 text-white/60">
              <tr>
                <th className="px-3 py-2 font-medium">Name</th>
                <th className="hidden px-3 py-2 font-medium sm:table-cell">Project</th>
                <th className="px-3 py-2 font-medium">Area (ha)</th>
                <th className="px-3 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-3 py-8 text-center text-white/40">
                    Loading sites...
                  </td>
                </tr>
              ) : sites.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-3 py-8 text-center text-white/40">
                    No sites found. Create your first site to get started.
                  </td>
                </tr>
              ) : (
                sites.map((s) => (
                  <tr key={s.id} className="border-t border-white/5 hover:bg-white/5">
                    <td className="px-3 py-2 text-white/80">{s.name}</td>
                    <td className="hidden px-3 py-2 text-[0.65rem] text-white/50 sm:table-cell">
                      {s.project_id.slice(0, 8)}...
                    </td>
                    <td className="px-3 py-2 text-white/60">{s.area_hectares ?? '—'}</td>
                    <td className="px-3 py-2">
                      <Link
                        href={`/dashboard/sites/${s.id}`}
                        className="text-cyan-400 hover:text-cyan-300 hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Site">
        <SiteForm onSuccess={handleSiteCreated} onCancel={() => setShowCreateModal(false)} />
      </Modal>
    </div>
  );
}
