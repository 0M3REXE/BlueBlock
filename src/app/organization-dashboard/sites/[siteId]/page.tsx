import { notFound } from 'next/navigation';
import { getSupabaseServer } from '../../../../lib/supabase/server';
import Link from 'next/link';
import { FieldMembersManager, FieldMemberRecord } from '../../../../components/FieldMembersManager';

interface Props { params: { siteId: string } }

async function fetchSite(siteId: string) {
  const supabase = getSupabaseServer();
  const { data: site } = await supabase.from('sites').select('*').eq('id', siteId).single();
  const { data: batches } = await supabase.from('planting_batches').select('id,batch_code,planting_start,planting_end,notes').eq('site_id', siteId).order('planting_start', { ascending: false });
  const { data: measurements } = await supabase.from('measurements').select('id,measured_at,avg_height_cm,survival_rate_percent').eq('site_id', siteId).order('measured_at', { ascending: false }).limit(10);
  const { data: photos } = await supabase.from('photos').select('id,storage_path,taken_at').eq('site_id', siteId).order('taken_at', { ascending: false }).limit(12);
  const { data: rawFieldMembers } = await supabase
    .from('site_field_members')
    .select('id,role,added_at,contact:contact_id(id,full_name,email,phone,role)')
    .eq('site_id', siteId)
    .order('added_at', { ascending: false });
  const fieldMembers: FieldMemberRecord[] = (rawFieldMembers || []).map((m): FieldMemberRecord => {
    const rec = m as { role?: string | null; added_at?: string | null; contact?: unknown };
    const contactCandidate = rec.contact as ( { id?: string; full_name?: string | null; email?: string | null; phone?: string | null; role?: string | null } | undefined ) | ( { id?: string; full_name?: string | null; email?: string | null; phone?: string | null; role?: string | null }[] );
    const c = Array.isArray(contactCandidate) ? contactCandidate[0] : contactCandidate;
    return {
      contact_id: c?.id || 'unknown',
      site_id: siteId,
      role: rec.role || c?.role || null,
      added_at: rec.added_at || null,
      contact: { id: c?.id || 'unknown', name: c?.full_name || null, email: c?.email || null, phone: c?.phone || null }
    };
  });
  return { site, batches: batches || [], measurements: measurements || [], photos: photos || [], fieldMembers };
}

export default async function SiteDetailPage({ params }: Props) {
  const { siteId } = params;
  const { site, batches, measurements, photos, fieldMembers } = await fetchSite(siteId);
  if (!site) return notFound();
  return (
    <div className="space-y-10">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold tracking-wide">Site: {site.name}</h1>
        <Link href="/organization-dashboard/sites" className="text-[0.65rem] text-emerald-300 hover:underline">Back to Sites</Link>
      </div>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border border-white/10 p-4 md:col-span-2">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/50">Metadata</h2>
          <dl className="grid grid-cols-2 gap-y-2 text-[0.7rem]">
            <dt className="text-white/40">Project ID</dt><dd className="text-white/80 break-all">{site.project_id}</dd>
            <dt className="text-white/40">Area (ha)</dt><dd className="text-white/80">{site.area_hectares ?? '—'}</dd>
            <dt className="text-white/40">Location Name</dt><dd className="text-white/80">{site.location_name ?? '—'}</dd>
            <dt className="text-white/40">Centroid</dt><dd className="text-white/80">{site.centroid_lat && site.centroid_lon ? `${site.centroid_lat.toFixed(4)}, ${site.centroid_lon.toFixed(4)}` : '—'}</dd>
            <dt className="text-white/40">Habitat</dt><dd className="text-white/80">{site.habitat_type ?? '—'}</dd>
          </dl>
        </div>
        <div className="rounded-lg border border-white/10 p-4">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/50">Latest Stats</h2>
          <ul className="space-y-2 text-[0.7rem]">
            <li className="flex justify-between"><span className="text-white/40">Measurements</span><span className="text-white/80">{measurements.length}</span></li>
            <li className="flex justify-between"><span className="text-white/40">Planting Batches</span><span className="text-white/80">{batches.length}</span></li>
            <li className="flex justify-between"><span className="text-white/40">Photos</span><span className="text-white/80">{photos.length}</span></li>
          </ul>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-white/50">Recent Measurements</h2>
        <div className="overflow-hidden rounded-lg border border-white/10">
          <table className="w-full text-left text-[0.65rem]">
            <thead className="bg-white/5 text-white/60">
              <tr>
                <th className="px-3 py-2 font-medium">Date</th>
                <th className="px-3 py-2 font-medium">Avg Height (cm)</th>
                <th className="px-3 py-2 font-medium">Survival %</th>
              </tr>
            </thead>
            <tbody>
              {measurements.map(m => (
                <tr key={m.id} className="border-t border-white/5 hover:bg-white/5">
                  <td className="px-3 py-2 text-white/80">{new Date(m.measured_at).toLocaleDateString()}</td>
                  <td className="px-3 py-2 text-white/70">{m.avg_height_cm ?? '—'}</td>
                  <td className="px-3 py-2 text-white/70">{m.survival_rate_percent ?? '—'}</td>
                </tr>
              ))}
              {measurements.length === 0 && (
                <tr><td colSpan={3} className="px-3 py-6 text-center text-white/40">No measurements yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-white/50">Planting Batches</h2>
        <div className="overflow-hidden rounded-lg border border-white/10">
          <table className="w-full text-left text-[0.65rem]">
            <thead className="bg-white/5 text-white/60">
              <tr>
                <th className="px-3 py-2 font-medium">Batch Code</th>
                <th className="px-3 py-2 font-medium">Start</th>
                <th className="px-3 py-2 font-medium">End</th>
                <th className="px-3 py-2 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {batches.map(b => (
                <tr key={b.id} className="border-t border-white/5 hover:bg-white/5">
                  <td className="px-3 py-2 text-white/80">{b.batch_code || '—'}</td>
                  <td className="px-3 py-2 text-white/70">{b.planting_start || '—'}</td>
                  <td className="px-3 py-2 text-white/70">{b.planting_end || '—'}</td>
                  <td className="px-3 py-2 text-white/60 max-w-[12rem] truncate" title={b.notes || ''}>{b.notes || '—'}</td>
                </tr>
              ))}
              {batches.length === 0 && (
                <tr><td colSpan={4} className="px-3 py-6 text-center text-white/40">No planting batches.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-white/50">Field Team ({fieldMembers.length})</h2>
        <div className="rounded-lg border border-white/10 p-4 bg-white/5">
          <FieldMembersManager siteId={siteId} initialMembers={fieldMembers} />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-white/50">Recent Photos</h2>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 md:grid-cols-8">
          {photos.map(p => (
            <div key={p.id} className="aspect-square overflow-hidden rounded bg-white/5 text-[0.55rem] flex items-center justify-center text-white/40">
              {p.storage_path.split('/').pop()}
            </div>
          ))}
          {photos.length === 0 && (
            <div className="col-span-full rounded border border-dashed border-white/10 p-6 text-center text-white/40 text-[0.65rem]">No photos yet.</div>
          )}
        </div>
      </section>

    </div>
  );
}
