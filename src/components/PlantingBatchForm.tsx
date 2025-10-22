"use client";

import { useState, useEffect } from 'react';

interface Species {
  id: string;
  common_name: string;
  scientific_name: string;
}

interface SpeciesEntry {
  species_id: string;
  saplings_planted: number;
}

interface PlantingBatchFormProps {
  siteId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function PlantingBatchForm({ siteId, onSuccess, onCancel }: PlantingBatchFormProps) {
  const [species, setSpecies] = useState<Species[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    batch_code: '',
    planting_start: '',
    planting_end: '',
    source_nursery: '',
    notes: '',
  });

  const [selectedSpecies, setSelectedSpecies] = useState<SpeciesEntry[]>([
    { species_id: '', saplings_planted: 0 },
  ]);

  useEffect(() => {
    async function fetchSpecies() {
      try {
        const res = await fetch('/api/species');
        if (res.ok) {
          const data = await res.json();
          setSpecies(data || []);
        }
      } catch (err) {
        console.error('Failed to fetch species:', err);
      }
    }
    fetchSpecies();
  }, []);

  const addSpeciesRow = () => {
    setSelectedSpecies([...selectedSpecies, { species_id: '', saplings_planted: 0 }]);
  };

  const removeSpeciesRow = (index: number) => {
    setSelectedSpecies(selectedSpecies.filter((_, i) => i !== index));
  };

  const updateSpeciesRow = (index: number, field: keyof SpeciesEntry, value: string | number) => {
    const updated = [...selectedSpecies];
    updated[index] = { ...updated[index], [field]: value };
    setSelectedSpecies(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const validSpecies = selectedSpecies.filter(
        (s) => s.species_id && s.saplings_planted > 0
      );

      if (validSpecies.length === 0) {
        throw new Error('Please add at least one species with saplings count');
      }

      const res = await fetch('/api/planting-batches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          site_id: siteId,
          ...formData,
          species: validSpecies,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create planting batch');
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
        <label className="mb-1 block text-sm font-medium text-white/90">Batch Code</label>
        <input
          type="text"
          value={formData.batch_code}
          onChange={(e) => setFormData({ ...formData, batch_code: e.target.value })}
          className="w-full rounded-lg border border-white/20 bg-[#031c22] px-3 py-2 text-sm text-white placeholder-white/40 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
          placeholder="e.g., MB-2024-01"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-white/90">
            Planting Start Date <span className="text-red-400">*</span>
          </label>
          <input
            type="date"
            required
            value={formData.planting_start}
            onChange={(e) => setFormData({ ...formData, planting_start: e.target.value })}
            className="w-full rounded-lg border border-white/20 bg-[#031c22] px-3 py-2 text-sm text-white focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-white/90">Planting End Date</label>
          <input
            type="date"
            value={formData.planting_end}
            onChange={(e) => setFormData({ ...formData, planting_end: e.target.value })}
            className="w-full rounded-lg border border-white/20 bg-[#031c22] px-3 py-2 text-sm text-white focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-white/90">Source Nursery</label>
        <input
          type="text"
          value={formData.source_nursery}
          onChange={(e) => setFormData({ ...formData, source_nursery: e.target.value })}
          className="w-full rounded-lg border border-white/20 bg-[#031c22] px-3 py-2 text-sm text-white placeholder-white/40 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
          placeholder="e.g., Government Nursery, Tamil Nadu"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-white/90">
          Species & Quantities <span className="text-red-400">*</span>
        </label>
        <div className="space-y-2">
          {selectedSpecies.map((entry, index) => (
            <div key={index} className="flex gap-2">
              <select
                value={entry.species_id}
                onChange={(e) => updateSpeciesRow(index, 'species_id', e.target.value)}
                className="flex-1 rounded-lg border border-white/20 bg-[#031c22] px-3 py-2 text-sm text-white focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
              >
                <option value="">Select species</option>
                {species.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.common_name} ({s.scientific_name})
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                value={entry.saplings_planted || ''}
                onChange={(e) =>
                  updateSpeciesRow(index, 'saplings_planted', parseInt(e.target.value) || 0)
                }
                className="w-28 rounded-lg border border-white/20 bg-[#031c22] px-3 py-2 text-sm text-white placeholder-white/40 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                placeholder="Count"
              />
              {selectedSpecies.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSpeciesRow(index)}
                  className="rounded-lg border border-red-400/20 px-3 py-2 text-sm text-red-400 hover:bg-red-400/10"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addSpeciesRow}
          className="mt-2 text-sm text-cyan-400 hover:text-cyan-300"
        >
          + Add Species
        </button>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-white/90">Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
          className="w-full rounded-lg border border-white/20 bg-[#031c22] px-3 py-2 text-sm text-white placeholder-white/40 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
          placeholder="Additional notes about this planting batch..."
        />
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
          {loading ? 'Creating...' : 'Create Batch'}
        </button>
      </div>
    </form>
  );
}
