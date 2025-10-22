"use client";

import { useState, useRef } from 'react';

interface GPSLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
}

interface MeasurementFormCompleteProps {
  siteId: string;
  siteName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function MeasurementFormComplete({
  siteId,
  siteName,
  onSuccess,
  onCancel,
}: MeasurementFormCompleteProps) {
  const [gpsLocation, setGpsLocation] = useState<GPSLocation | null>(null);
  const [gpsError, setGpsError] = useState('');
  const [gpsLoading, setGpsLoading] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    measurement_date: new Date().toISOString().split('T')[0],
    plot_number: '',
    latitude: '',
    longitude: '',
    avg_height_cm: '',
    survival_rate_percent: '',
    canopy_cover_percent: '',
    notes: '',
  });

  const detectGPS = async () => {
    setGpsLoading(true);
    setGpsError('');

    if (!navigator.geolocation) {
      setGpsError('GPS not supported on this device');
      setGpsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        setGpsLocation(location);
        setFormData((prev) => ({
          ...prev,
          latitude: location.latitude.toFixed(6),
          longitude: location.longitude.toFixed(6),
        }));
        setGpsLoading(false);
      },
      (err) => {
        setGpsError(`GPS Error: ${err.message}`);
        setGpsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setPhotos((prev) => [...prev, ...newFiles]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // TODO: Upload photos to Supabase Storage
      // TODO: Create measurement record with all fields
      // For now, just a basic POST
      const res = await fetch('/api/measurements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          site_id: siteId,
          measurement_date: formData.measurement_date,
          plot_number: formData.plot_number || null,
          latitude: parseFloat(formData.latitude) || null,
          longitude: parseFloat(formData.longitude) || null,
          avg_height_cm: parseFloat(formData.avg_height_cm) || null,
          survival_rate_percent: parseFloat(formData.survival_rate_percent) || null,
          canopy_cover_percent: parseFloat(formData.canopy_cover_percent) || null,
          notes: formData.notes || null,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create measurement');
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

      <div className="rounded-lg border border-cyan-400/20 bg-cyan-400/5 p-3">
        <p className="text-xs text-cyan-300">
          <strong>Recording for:</strong> {siteName}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-white/90">
            Measurement Date <span className="text-red-400">*</span>
          </label>
          <input
            type="date"
            required
            value={formData.measurement_date}
            onChange={(e) => setFormData({ ...formData, measurement_date: e.target.value })}
            className="w-full rounded-lg border border-white/20 bg-[#031c22] px-3 py-2 text-sm text-white focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-white/90">Plot Number</label>
          <input
            type="text"
            value={formData.plot_number}
            onChange={(e) => setFormData({ ...formData, plot_number: e.target.value })}
            className="w-full rounded-lg border border-white/20 bg-[#031c22] px-3 py-2 text-sm text-white placeholder-white/40 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
            placeholder="e.g., P-01"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-white/90">GPS Location</label>
        <button
          type="button"
          onClick={detectGPS}
          disabled={gpsLoading}
          className="w-full rounded-lg border border-white/20 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300 transition hover:bg-cyan-500/20 disabled:opacity-50 sm:w-auto"
        >
          {gpsLoading ? 'Detecting...' : '📍 Auto-Detect GPS'}
        </button>
        {gpsLocation && (
          <p className="text-xs text-emerald-400">
            ✓ Location detected (±{gpsLocation.accuracy.toFixed(0)}m accuracy)
          </p>
        )}
        {gpsError && <p className="text-xs text-red-400">{gpsError}</p>}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <input
              type="number"
              step="0.000001"
              value={formData.latitude}
              onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
              className="w-full rounded-lg border border-white/20 bg-[#031c22] px-3 py-2 text-sm text-white placeholder-white/40 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
              placeholder="Latitude"
            />
          </div>
          <div>
            <input
              type="number"
              step="0.000001"
              value={formData.longitude}
              onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
              className="w-full rounded-lg border border-white/20 bg-[#031c22] px-3 py-2 text-sm text-white placeholder-white/40 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
              placeholder="Longitude"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-white/90">Avg Height (cm)</label>
          <input
            type="number"
            step="0.1"
            value={formData.avg_height_cm}
            onChange={(e) => setFormData({ ...formData, avg_height_cm: e.target.value })}
            className="w-full rounded-lg border border-white/20 bg-[#031c22] px-3 py-2 text-sm text-white placeholder-white/40 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
            placeholder="150"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-white/90">
            Survival Rate (%)
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="100"
            value={formData.survival_rate_percent}
            onChange={(e) =>
              setFormData({ ...formData, survival_rate_percent: e.target.value })
            }
            className="w-full rounded-lg border border-white/20 bg-[#031c22] px-3 py-2 text-sm text-white placeholder-white/40 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
            placeholder="85"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-white/90">
            Canopy Cover (%)
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="100"
            value={formData.canopy_cover_percent}
            onChange={(e) =>
              setFormData({ ...formData, canopy_cover_percent: e.target.value })
            }
            className="w-full rounded-lg border border-white/20 bg-[#031c22] px-3 py-2 text-sm text-white placeholder-white/40 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
            placeholder="60"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-white/90">Photos</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          onChange={handlePhotoCapture}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full rounded-lg border border-dashed border-white/20 bg-white/5 px-4 py-3 text-sm text-white/70 transition hover:border-cyan-400/30 hover:bg-white/10"
        >
          📷 Capture Photos ({photos.length} selected)
        </button>
        {photos.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {photos.map((file, index) => (
              <div
                key={index}
                className="group relative h-16 w-16 overflow-hidden rounded-lg border border-white/10"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Photo ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute right-0 top-0 bg-red-500 px-1.5 py-0.5 text-xs text-white opacity-0 transition group-hover:opacity-100"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-white/90">Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
          className="w-full rounded-lg border border-white/20 bg-[#031c22] px-3 py-2 text-sm text-white placeholder-white/40 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
          placeholder="Observations, weather conditions, issues noted..."
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
          {loading ? 'Submitting...' : 'Submit Measurement'}
        </button>
      </div>
    </form>
  );
}
