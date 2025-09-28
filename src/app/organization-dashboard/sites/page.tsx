import { getSupabaseServer } from '../../../lib/supabase/server';
import Link from 'next/link';

export const metadata = { title: 'Sites - Organization Dashboard' };

async function fetchSites() {
  const supabase = getSupabaseServer();
  const { data } = await supabase.from('sites').select('id,name,area_hectares,project_id').limit(50);
  return data || [];
}

export default async function SitesListPage() {
  const sites = await fetchSites();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold tracking-wide">Field Sites</h1>
      </div>
      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-left text-xs">
          <thead className="bg-white/5 text-white/60">
            <tr>
              <th className="px-3 py-2 font-medium">Name</th>
              <th className="px-3 py-2 font-medium">Project</th>
              <th className="px-3 py-2 font-medium">Area (ha)</th>
              <th className="px-3 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sites.map(s => (
              <tr key={s.id} className="border-t border-white/5 hover:bg-white/5">
                <td className="px-3 py-2 text-white/80">{s.name}</td>
                <td className="px-3 py-2 text-white/50 text-[0.65rem]">{s.project_id}</td>
                <td className="px-3 py-2 text-white/60">{s.area_hectares ?? '—'}</td>
                <td className="px-3 py-2">
                  <Link href={`/organization-dashboard/sites/${s.id}`} className="text-emerald-300 hover:underline">Open</Link>
                </td>
              </tr>
            ))}
            {sites.length === 0 && (
              <tr>
                <td colSpan={4} className="px-3 py-8 text-center text-white/40">No sites found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-[0.65rem] text-white/40">(Later: filters, pagination, search, org scoping)</p>
    </div>
  );
}
