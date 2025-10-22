"use client";

import { useState, useEffect } from 'react';

interface Project {
  id: string;
  name: string;
}

interface SiteFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: {
    id?: string;
    name?: string;
    project_id?: string;
    location_name?: string;
    centroid_lat?: number;
    centroid_lon?: number;
    area_hectares?: number;
    habitat_type?: string;
  };
}

export default function SiteForm({ onSuccess, onCancel, initialData }: SiteFormProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    project_id: initialData?.project_id || '',
    location_name: initialData?.location_name || '',
    centroid_lat: initialData?.centroid_lat?.toString() || '',
    centroid_lon: initialData?.centroid_lon?.toString() || '',
    area_hectares: initialData?.area_hectares?.toString() || '',
    habitat_type: initialData?.habitat_type || '',
  });

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('/api/projects');
        if (res.ok) {
          const data = await res.json();
          setProjects(data || []);
        }
      } catch (err) {
        console.error('Failed to fetch projects:', err);
      }
    }
    fetchProjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        centroid_lat: formData.centroid_lat ? parseFloat(formData.centroid_lat) : null,
        centroid_lon: formData.centroid_lon ? parseFloat(formData.centroid_lon) : null,
        area_hectares: formData.area_hectares ? parseFloat(formData.area_hectares) : null,
      };

      const url = initialData?.id ? `/api/sites/${initialData.id}` : '/api/sites';
      const method = initialData?.id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save site');
      }

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-white/90">
          Site Name <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full rounded-lg border border-white/20 bg-[#031c22] px-3 py-2 text-sm text-white placeholder-white/40 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
          placeholder="e.g., Mangrove Bay Restoration"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-white/90">
          Project <span className="text-red-400">*</span>
        </label>
        <select
          required
          value={formData.project_id}
          onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
          className="w-full rounded-lg border border-white/20 bg-[#031c22] px-3 py-2 text-sm text-white focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
        >
          <option value="">Select a project</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-white/90">Location Name</label>
        <input
          type="text"
          value={formData.location_name}
          onChange={(e) => setFormData({ ...formData, location_name: e.target.value })}
          className="w-full rounded-lg border border-white/20 bg-[#031c22] px-3 py-2 text-sm text-white placeholder-white/40 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
          placeholder="e.g., Tamil Nadu Coast"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-white/90">Latitude</label>
          <input
            type="number"
            step="any"
            value={formData.centroid_lat}
            onChange={(e) => setFormData({ ...formData, centroid_lat: e.target.value })}
            className="w-full rounded-lg border border-white/20 bg-[#031c22] px-3 py-2 text-sm text-white placeholder-white/40 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
            placeholder="11.2345"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-white/90">Longitude</label>
          <input
            type="number"
            step="any"
            value={formData.centroid_lon}
            onChange={(e) => setFormData({ ...formData, centroid_lon: e.target.value })}
            className="w-full rounded-lg border border-white/20 bg-[#031c22] px-3 py-2 text-sm text-white placeholder-white/40 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
            placeholder="76.5432"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-white/90">Area (hectares)</label>
          <input
            type="number"
            step="any"
            value={formData.area_hectares}
            onChange={(e) => setFormData({ ...formData, area_hectares: e.target.value })}
            className="w-full rounded-lg border border-white/20 bg-[#031c22] px-3 py-2 text-sm text-white placeholder-white/40 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
            placeholder="12.5"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-white/90">Habitat Type</label>
          <select
            value={formData.habitat_type}
            onChange={(e) => setFormData({ ...formData, habitat_type: e.target.value })}
            className="w-full rounded-lg border border-white/20 bg-[#031c22] px-3 py-2 text-sm text-white focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
          >
            <option value="">Select habitat type</option>
            <option value="Mangrove">Mangrove</option>
            <option value="Seagrass">Seagrass</option>
            <option value="Salt Marsh">Salt Marsh</option>
            <option value="Coastal Forest">Coastal Forest</option>
            <option value="Coral Reef">Coral Reef</option>
            <option value="Mixed">Mixed</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-cyan-500 px-6 py-2 text-sm font-semibold text-[#062024] transition hover:bg-cyan-400 disabled:opacity-50"
        >
          {loading ? 'Saving...' : initialData?.id ? 'Update Site' : 'Create Site'}
        </button>
      </div>
    </form>
  );
}
