"use client";

import { useState } from 'react';

interface ProjectFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ProjectForm({ onSuccess, onCancel }: ProjectFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    human_project_code: '',
    description: '',
    region: '',
    baseline_date: '',
    restoration_method: '',
    baseline_carbon_tco2e: '',
    est_sequestration_tco2e: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        baseline_carbon_tco2e: formData.baseline_carbon_tco2e ? parseFloat(formData.baseline_carbon_tco2e) : null,
        est_sequestration_tco2e: formData.est_sequestration_tco2e ? parseFloat(formData.est_sequestration_tco2e) : null,
        baseline_date: formData.baseline_date || null,
      };

      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create project');
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
          Project Name <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full rounded-lg border border-white/20 bg-[#031c22] px-3 py-2 text-sm text-white placeholder-white/40 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
          placeholder="e.g., Tamil Nadu Coastal Restoration 2024"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-white/90">Project Code</label>
        <input
          type="text"
          value={formData.human_project_code}
          onChange={(e) => setFormData({ ...formData, human_project_code: e.target.value })}
          className="w-full rounded-lg border border-white/20 bg-[#031c22] px-3 py-2 text-sm text-white placeholder-white/40 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
          placeholder="e.g., TN-COAST-2024"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-white/90">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full rounded-lg border border-white/20 bg-[#031c22] px-3 py-2 text-sm text-white placeholder-white/40 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
          placeholder="Brief description of the restoration project..."
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-white/90">Region</label>
          <input
            type="text"
            value={formData.region}
            onChange={(e) => setFormData({ ...formData, region: e.target.value })}
            className="w-full rounded-lg border border-white/20 bg-[#031c22] px-3 py-2 text-sm text-white placeholder-white/40 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
            placeholder="e.g., Tamil Nadu"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-white/90">Baseline Date</label>
          <input
            type="date"
            value={formData.baseline_date}
            onChange={(e) => setFormData({ ...formData, baseline_date: e.target.value })}
            className="w-full rounded-lg border border-white/20 bg-[#031c22] px-3 py-2 text-sm text-white focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-white/90">Restoration Method</label>
        <select
          value={formData.restoration_method}
          onChange={(e) => setFormData({ ...formData, restoration_method: e.target.value })}
          className="w-full rounded-lg border border-white/20 bg-[#031c22] px-3 py-2 text-sm text-white focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
        >
          <option value="">Select method</option>
          <option value="Direct Planting">Direct Planting</option>
          <option value="Natural Regeneration">Natural Regeneration</option>
          <option value="Assisted Regeneration">Assisted Regeneration</option>
          <option value="Mixed Approach">Mixed Approach</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-white/90">
            Baseline Carbon (tCO₂e)
          </label>
          <input
            type="number"
            step="any"
            value={formData.baseline_carbon_tco2e}
            onChange={(e) => setFormData({ ...formData, baseline_carbon_tco2e: e.target.value })}
            className="w-full rounded-lg border border-white/20 bg-[#031c22] px-3 py-2 text-sm text-white placeholder-white/40 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
            placeholder="1000"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-white/90">
            Est. Sequestration (tCO₂e)
          </label>
          <input
            type="number"
            step="any"
            value={formData.est_sequestration_tco2e}
            onChange={(e) => setFormData({ ...formData, est_sequestration_tco2e: e.target.value })}
            className="w-full rounded-lg border border-white/20 bg-[#031c22] px-3 py-2 text-sm text-white placeholder-white/40 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
            placeholder="5000"
          />
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
          {loading ? 'Creating...' : 'Create Project'}
        </button>
      </div>
    </form>
  );
}
