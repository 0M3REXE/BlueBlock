interface Step {
  title: string;
  text: string;
}

const STEPS: Step[] = [
  { title: '1. Collect', text: 'Ingest satellite, sensor, and field observations securely.' },
  { title: '2. Verify', text: 'Independent validators review cryptographic evidence.' },
  { title: '3. Aggregate', text: 'Data unified into time-series biomass & carbon metrics.' },
  { title: '4. Issue', text: 'Generate and route carbon credit issuance artifacts.' },
];

export default function WorkflowSection() {
  return (
    <section className="mx-auto max-w-5xl py-24" id="workflow">
      <div className="mb-12 flex flex-col gap-3">
        <h2 className="font-heading text-2xl font-semibold tracking-tight text-white sm:text-3xl">Workflow</h2>
        <p className="max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base">
          A streamlined evidence pipeline — from raw observations to issuance-ready reporting.
        </p>
      </div>
      <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map(s => (
          <li key={s.title} className="group relative flex flex-col gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-5">
            <h3 className="text-sm font-semibold text-cyan-300">{s.title}</h3>
            <p className="text-xs leading-relaxed text-white/60 sm:text-sm">{s.text}</p>
            <span className="pointer-events-none absolute inset-0 rounded-lg ring-0 transition group-hover:ring-1 group-hover:ring-cyan-300/40" />
          </li>
        ))}
      </ol>
    </section>
  );
}
