import { getSupabaseServer } from '../../../lib/supabase/server';

async function fetchSummary() {
  const supabase = getSupabaseServer();
  const { data: projects } = await supabase.from('projects').select('id');
  const { data: sites } = await supabase.from('sites').select('id');
  const { data: measurements } = await supabase.from('measurements').select('id');
  return { projectCount: projects?.length || 0, siteCount: sites?.length || 0, measurementCount: measurements?.length || 0 };
}

export default async function OrgDashboardPage() {
  const summary = await fetchSummary().catch(() => ({ projectCount: 0, siteCount: 0, measurementCount: 0 }));
  return (
    <div className="space-y-6 sm:space-y-8">
      <h1 className="text-base font-semibold tracking-wide sm:text-lg">Organization Overview</h1>
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        <KPI label="Projects" value={summary.projectCount} />
        <KPI label="Sites" value={summary.siteCount} />
        <KPI label="Measurements" value={summary.measurementCount} />
      </div>
      <div className="rounded-lg border border-white/10 p-4 text-xs text-white/60">
        <p className="mb-2 font-semibold text-white/80">Next Steps</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Add RLS policies to scope these counts to the current user/org.</li>
          <li>Create project list with pagination.</li>
          <li>Add recent measurements table.</li>
        </ul>
      </div>
    </div>
  );
}

function KPI({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-white/[0.03] p-3.5 ring-1 ring-white/10 sm:p-4">
      <div className="text-[0.55rem] uppercase tracking-[0.2em] text-white/40 sm:text-[0.6rem] sm:tracking-[0.25em]">{label}</div>
      <div className="mt-2 text-xl font-semibold tabular-nums text-white sm:text-2xl">{value}</div>
    </div>
  );
}
