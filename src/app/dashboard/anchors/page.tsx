import { getSupabaseServer } from '../../../lib/supabase/server';

interface AnchorRow {
  id: string;
  project_id: string | null;
  merkle_root: string;
  tx_id: string | null;
  round: number | null;
  created_at: string;
}

export const dynamic = 'force-dynamic';

export default async function AnchorsPage() {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from('onchain_anchors')
    .select('id, project_id, merkle_root, tx_id, round, created_at')
    .order('created_at', { ascending: false })
    .limit(100);

  const rows: AnchorRow[] = !error && Array.isArray(data) ? (data as AnchorRow[]) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">On-Chain Anchors</h1>
        <p className="text-sm text-gray-500">Latest Merkle root anchor transactions recorded on Algorand.</p>
      </div>

      <div className="overflow-x-auto border rounded-md">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-3 py-2 text-left font-medium">ID</th>
              <th className="px-3 py-2 text-left font-medium">Project</th>
              <th className="px-3 py-2 text-left font-medium">Merkle Root</th>
              <th className="px-3 py-2 text-left font-medium">Round</th>
              <th className="px-3 py-2 text-left font-medium">Tx</th>
              <th className="px-3 py-2 text-left font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(a => (
              <tr key={a.id} className="border-t hover:bg-gray-50">
                <td className="px-3 py-2 font-mono text-xs">{a.id.slice(0,8)}</td>
                <td className="px-3 py-2 text-gray-700">{a.project_id ? a.project_id.slice(0,8) : '-'}</td>
                <td className="px-3 py-2 font-mono text-[10px] break-all max-w-[220px]">{a.merkle_root}</td>
                <td className="px-3 py-2">{a.round ?? '-'}</td>
                <td className="px-3 py-2 font-mono text-[10px] break-all max-w-[160px]">{a.tx_id || '-'}</td>
                <td className="px-3 py-2 text-gray-500">{new Date(a.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-gray-500">No anchors recorded.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
