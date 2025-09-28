import { getSupabaseServer } from '../../lib/supabase/server';

interface VerificationRow {
  id: string;
  site_id: string | null;
  project_id: string | null;
  status: string;
  method: string | null;
  created_at: string;
  findings_count: number | null;
}

interface VerificationQueryRow {
  id: string;
  site_id: string | null;
  project_id: string | null;
  status: string;
  method: string | null;
  created_at: string;
  verification_findings?: { count: number }[];
}

export const dynamic = 'force-dynamic';

export default async function VerifierDashboardPage() {
  const supabase = getSupabaseServer();

  const { data, error } = await supabase
    .from('verifications')
    .select('id, site_id, project_id, status, method, created_at, verification_findings(count)')
    .order('created_at', { ascending: false })
    .limit(50);

  const rows: VerificationRow[] = !error && Array.isArray(data) ? (data as VerificationQueryRow[]).map((r) => ({
    id: r.id,
    site_id: r.site_id,
    project_id: r.project_id,
    status: r.status,
    method: r.method,
    created_at: r.created_at,
    findings_count: Array.isArray(r.verification_findings) && r.verification_findings.length > 0 ? r.verification_findings[0].count : 0,
  })) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Verifier Dashboard</h1>
        <p className="text-sm text-white/60">Recent verification activities and statuses.</p>
      </div>

      <div className="overflow-x-auto border border-white/10 rounded-md">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5 text-white/60">
            <tr>
              <th className="px-3 py-2 text-left font-medium">ID</th>
              <th className="px-3 py-2 text-left font-medium">Site</th>
              <th className="px-3 py-2 text-left font-medium">Project</th>
              <th className="px-3 py-2 text-left font-medium">Status</th>
              <th className="px-3 py-2 text-left font-medium">Method</th>
              <th className="px-3 py-2 text-left font-medium">Findings</th>
              <th className="px-3 py-2 text-left font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(v => (
              <tr key={v.id} className="border-t border-white/10 hover:bg-white/5">
                <td className="px-3 py-2 font-mono text-xs">{v.id.slice(0,8)}</td>
                <td className="px-3 py-2">{v.site_id ? v.site_id.slice(0,8) : '-'}</td>
                <td className="px-3 py-2">{v.project_id ? v.project_id.slice(0,8) : '-'}</td>
                <td className="px-3 py-2"><StatusBadge status={v.status} /></td>
                <td className="px-3 py-2">{v.method || '-'}</td>
                <td className="px-3 py-2 text-center">{v.findings_count ?? 0}</td>
                <td className="px-3 py-2 text-white/50">{new Date(v.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-6 text-center text-white/40">No verifications found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const color = statusColors[status?.toLowerCase()] || 'bg-white/20 text-white';
  return <span className={`inline-block px-2 py-1 rounded text-[0.6rem] font-medium ${color}`}>{status}</span>;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-400/20 text-yellow-300',
  'in_review': 'bg-blue-400/20 text-blue-300',
  approved: 'bg-green-400/20 text-green-300',
  rejected: 'bg-red-400/20 text-red-300',
};
