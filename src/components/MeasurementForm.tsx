"use client";
import { useState } from 'react';
import PhotoUploader from './PhotoUploader';

export default function MeasurementForm({ siteId }: { siteId: string }) {
  const [measuredAt, setMeasuredAt] = useState(new Date().toISOString().slice(0,10));
  const [avgHeight, setAvgHeight] = useState<number | ''>('');
  const [survival, setSurvival] = useState<number | ''>('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');

  async function submit(e?: React.FormEvent) {
    e?.preventDefault?.();
    setSubmitting(true); setMsg('');
    try {
      const res = await fetch('/api/measurements', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ site_id: siteId, measured_at: measuredAt, avg_height_cm: avgHeight || null, survival_rate_percent: survival || null })
      });
      if (!res.ok) throw new Error('Failed');
      setMsg('Saved');
  } catch (err) { console.error(err); setMsg('Error'); }
    finally { setSubmitting(false); setTimeout(()=>setMsg(''), 2000); }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="block text-xs sm:text-sm">Date</label>
        <input type="date" value={measuredAt} onChange={e=>setMeasuredAt(e.target.value)} className="w-full rounded border border-white/20 bg-[#031c22] px-2 py-2 text-sm" />
      </div>
      <div>
        <label className="block text-xs sm:text-sm">Avg Height (cm)</label>
        <input type="number" value={avgHeight} onChange={e=>setAvgHeight(e.target.value===''? '': Number(e.target.value))} className="w-full rounded border border-white/20 bg-[#031c22] px-2 py-2 text-sm" />
      </div>
      <div>
        <label className="block text-xs sm:text-sm">Survival %</label>
        <input type="number" value={survival} onChange={e=>setSurvival(e.target.value===''? '': Number(e.target.value))} className="w-full rounded border border-white/20 bg-[#031c22] px-2 py-2 text-sm" />
      </div>
      <PhotoUploader siteId={siteId} onUploaded={(path)=>console.log('uploaded', path)} />
      <div className="flex flex-col gap-2 sm:flex-row">
        <button disabled={submitting} type="submit" className="rounded bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700 disabled:opacity-50 sm:text-base">{submitting ? 'Saving...' : 'Save Measurement'}</button>
        <button type="button" onClick={()=>{ setAvgHeight(''); setSurvival(''); }} className="rounded border px-4 py-2 text-sm hover:bg-white/10 sm:text-base">Clear</button>
      </div>
      {msg && <div className="text-xs text-white/60 sm:text-sm">{msg}</div>}
    </form>
  );
}
