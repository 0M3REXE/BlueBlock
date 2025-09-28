"use client";
import { useState } from 'react';

export default function FieldDataEntryPage() {
  const [siteId, setSiteId] = useState('');
  const [batchId, setBatchId] = useState('');
  const [speciesId, setSpeciesId] = useState('');
  const [count, setCount] = useState<number | ''>('');
  const [status, setStatus] = useState<'idle'|'submitting'|'success'|'error'>('idle');
  const [message, setMessage] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');
    setMessage('');
    try {
      const res = await fetch('/api/measurements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ site_id: siteId, planting_batch_id: batchId || null, species_id: speciesId || null, tree_count: count === '' ? null : count })
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
      setMessage('Measurement recorded (placeholder).');
      setCount('');
    } catch (err: unknown) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Error');
    } finally {
      setTimeout(()=> setStatus('idle'), 2000);
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Field Data Entry</h1>
        <p className="text-sm text-gray-500">Placeholder form for recording new measurement counts.</p>
      </div>

      <form onSubmit={submit} className="space-y-4 border p-4 rounded-md bg-white">
        <div>
          <label className="block text-xs font-medium mb-1">Site ID</label>
          <input value={siteId} onChange={e=>setSiteId(e.target.value)} className="w-full border rounded px-2 py-1 text-sm" placeholder="uuid-of-site" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium mb-1">Planting Batch ID</label>
            <input value={batchId} onChange={e=>setBatchId(e.target.value)} className="w-full border rounded px-2 py-1 text-sm" placeholder="optional" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Species ID</label>
            <input value={speciesId} onChange={e=>setSpeciesId(e.target.value)} className="w-full border rounded px-2 py-1 text-sm" placeholder="optional" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Tree Count</label>
          <input type="number" value={count} onChange={e=>setCount(e.target.value === '' ? '' : Number(e.target.value))} className="w-full border rounded px-2 py-1 text-sm" placeholder="e.g. 120" />
        </div>
        <button disabled={status==='submitting'} className="px-4 py-2 bg-black text-white rounded text-sm disabled:opacity-50">
          {status==='submitting' ? 'Saving...' : 'Submit Measurement'}
        </button>
        {message && <p className={`text-xs ${status==='error' ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}
      </form>

      <div className="border rounded-md p-4 bg-gray-50 text-xs text-gray-600">
        Photo upload placeholder: future UI will allow attaching geo-tagged images & raw measurement files.
      </div>
    </div>
  );
}
