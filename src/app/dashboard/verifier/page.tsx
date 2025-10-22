"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Site {
  id: string;
  name: string;
  location_name: string | null;
  area_hectares: number | null;
}

interface Measurement {
  id: string;
  measurement_date: string;
  avg_height_cm: number | null;
  survival_rate_percent: number | null;
}

export default function VerifierDashboardPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // In production, this would filter by assigned organizations
        const [sitesRes, measurementsRes] = await Promise.all([
          fetch('/api/sites'),
          fetch('/api/measurements'),
        ]);

        if (sitesRes.ok) {
          const sitesData = await sitesRes.json();
          setSites(sitesData || []);
        }

        if (measurementsRes.ok) {
          const measurementsData = await measurementsRes.json();
          setMeasurements(measurementsData || []);
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const kpis = [
    {
      label: 'Sites to Review',
      value: loading ? '...' : sites.length,
      color: 'text-blue-400',
    },
    {
      label: 'Recent Measurements',
      value: loading ? '...' : measurements.length,
      color: 'text-cyan-400',
    },
    {
      label: 'Pending Verifications',
      value: '—',
      color: 'text-yellow-400',
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-base font-semibold tracking-wide sm:text-lg">
          Verifier Dashboard
        </h1>
        <p className="mt-1 text-xs text-white/50">
          Review and verify carbon sequestration claims
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        {kpis.map((kpi, i) => (
          <div
            key={i}
            className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-6"
          >
            <p className="mb-1 text-xs text-white/50 sm:text-sm">{kpi.label}</p>
            <p className={`text-2xl font-bold sm:text-3xl ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-sm font-medium text-white/80 sm:text-base">
          Sites Requiring Verification
        </h2>
        <div className="overflow-hidden rounded-lg border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-white/5 text-white/60">
                <tr>
                  <th className="px-3 py-2 font-medium">Site Name</th>
                  <th className="hidden px-3 py-2 font-medium sm:table-cell">Location</th>
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
                      No sites assigned for verification.
                    </td>
                  </tr>
                ) : (
                  sites.slice(0, 10).map((site) => (
                    <tr key={site.id} className="border-t border-white/5 hover:bg-white/5">
                      <td className="px-3 py-2 text-white/80">{site.name}</td>
                      <td className="hidden px-3 py-2 text-white/50 sm:table-cell">
                        {site.location_name || '—'}
                      </td>
                      <td className="px-3 py-2 text-white/60">{site.area_hectares ?? '—'}</td>
                      <td className="px-3 py-2">
                        <Link
                          href={`/dashboard/sites/${site.id}`}
                          className="text-cyan-400 hover:text-cyan-300 hover:underline"
                        >
                          Review
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-sm font-medium text-white/80 sm:text-base">
          Recent Measurements
        </h2>
        <div className="overflow-hidden rounded-lg border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-white/5 text-white/60">
                <tr>
                  <th className="px-3 py-2 font-medium">Date</th>
                  <th className="px-3 py-2 font-medium">Avg Height</th>
                  <th className="px-3 py-2 font-medium">Survival Rate</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-3 py-8 text-center text-white/40">
                      Loading measurements...
                    </td>
                  </tr>
                ) : measurements.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-3 py-8 text-center text-white/40">
                      No measurements to verify.
                    </td>
                  </tr>
                ) : (
                  measurements.slice(0, 10).map((m) => (
                    <tr key={m.id} className="border-t border-white/5 hover:bg-white/5">
                      <td className="px-3 py-2 text-white/80">{m.measurement_date}</td>
                      <td className="px-3 py-2 text-white/60">{m.avg_height_cm ?? '—'} cm</td>
                      <td className="px-3 py-2 text-white/60">
                        {m.survival_rate_percent ?? '—'}%
                      </td>
                      <td className="px-3 py-2">
                        <span className="rounded-full bg-yellow-400/10 px-2 py-1 text-xs text-yellow-400">
                          Pending
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-xs text-white/60">
        <p className="mb-2 font-medium text-white/80">Next Steps</p>
        <ul className="list-inside list-disc space-y-1">
          <li>Implement verification workflow (create verification records)</li>
          <li>Add verification findings and status updates</li>
          <li>Filter sites by assigned organizations</li>
          <li>Add document upload for verification reports</li>
        </ul>
      </div>
    </div>
  );
}
