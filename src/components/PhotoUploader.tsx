"use client";
import { useState } from 'react';
import { getSupabaseBrowser } from '../lib/supabase/client';

export default function PhotoUploader({ siteId, onUploaded }: { siteId: string; onUploaded?: (path: string)=>void }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  async function upload() {
    if (!file) return;
    setUploading(true);
    try {
      const supabase = getSupabaseBrowser();
      const key = `${siteId}/${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage.from('site-photos').upload(key, file);
  if (error) throw error;
  supabase.storage.from('site-photos').getPublicUrl(data.path);
  onUploaded?.(data.path);
      setFile(null);
    } catch (e) {
      console.error(e);
    } finally { setUploading(false); }
  }

  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium">Photo</label>
      <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0]||null)} className="block w-full text-sm" />
      <div className="flex gap-2">
        <button disabled={!file || uploading} onClick={upload} className="px-3 py-2 rounded bg-emerald-600 text-white disabled:opacity-50">{uploading ? 'Uploading...' : 'Upload'}</button>
        <button onClick={()=>setFile(null)} className="px-3 py-2 rounded border border-white/10 text-sm">Clear</button>
      </div>
    </div>
  );
}
