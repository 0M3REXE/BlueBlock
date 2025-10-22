"use client";

import { useState } from 'react';
import SiteSelector from '@/components/SiteSelector';
import MeasurementFormComplete from '@/components/MeasurementFormComplete';

export default function FieldDashboardPage() {
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
  const [selectedSiteName, setSelectedSiteName] = useState<string>('');

  const handleSelectSite = (siteId: string) => {
    // Fetch site name for display
    fetch(`/api/sites?id=${siteId}`)
      .then((res) => res.json())
      .then((sites) => {
        const site = sites.find((s: { id: string; name: string }) => s.id === siteId);
        if (site) {
          setSelectedSiteName(site.name);
          setSelectedSiteId(siteId);
        }
      })
      .catch((err) => console.error('Failed to fetch site name:', err));
  };

  const handleMeasurementSuccess = () => {
    // Return to site selection after successful submission
    setSelectedSiteId(null);
    setSelectedSiteName('');
  };

  const handleCancel = () => {
    setSelectedSiteId(null);
    setSelectedSiteName('');
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-base font-semibold tracking-wide sm:text-lg">
            Field Data Collection
          </h1>
          <p className="mt-1 text-xs text-white/50">
            Record measurements for your assigned sites
          </p>
        </div>
        {selectedSiteId && (
          <button
            onClick={handleCancel}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10"
          >
            ← Back to Sites
          </button>
        )}
      </div>

      {!selectedSiteId ? (
        <SiteSelector onSelectSite={handleSelectSite} />
      ) : (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-6">
          <MeasurementFormComplete
            siteId={selectedSiteId}
            siteName={selectedSiteName}
            onSuccess={handleMeasurementSuccess}
            onCancel={handleCancel}
          />
        </div>
      )}
    </div>
  );
}
