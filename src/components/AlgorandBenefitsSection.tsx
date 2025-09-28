interface Benefit {
  title: string;
  text: string;
  tag?: string;
}

const BENEFITS: Benefit[] = [
  {
    title: "Low Carbon Footprint",
    text: "Algorand's pure proof-of-stake architecture is designed for minimal energy use, reinforcing climate integrity for blue carbon accounting.",
    tag: "SUSTAINABILITY"
  },
  {
    title: "Finality in Seconds",
    text: "Fast settlement ensures MRV evidence and attestations are reliably anchored on-chain without long confirmation delays.",
    tag: "SPEED"
  },
  {
    title: "Low & Predictable Fees",
    text: "Keeps high-frequency environmental data commitments economically viable across long project lifecycles.",
    tag: "COST"
  },
  {
    title: "On-Chain Verifiability",
    text: "Smart contracts and state proofs enable transparent validation flows for measurement and reporting artifacts.",
    tag: "VERIFIABILITY"
  },
  {
    title: "Scalable Participation",
    text: "Supports multi-stakeholder governance: project developers, field teams, verifiers, and registries.",
    tag: "GOVERNANCE"
  },
  {
    title: "Ecosystem Tooling",
    text: "Rich SDKs & indexing infra simplify integrating sensor pipelines and analytical services.",
    tag: "TOOLING"
  },
];

export default function AlgorandBenefitsSection() {
  return (
    <section id="algorand" className="mx-auto max-w-5xl py-24">
      <div className="mb-12 flex flex-col gap-4">
        <h2 className="font-heading text-2xl font-semibold tracking-tight text-white sm:text-3xl">Why Algorand?</h2>
        <p className="max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base">
          The platform&apos;s integrity depends on a blockchain that is energy-efficient, fast, and verifiable. Algorand offers a technically aligned foundation for cryptographically anchored environmental data and carbon issuance workflows.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {BENEFITS.map(b => (
          <div key={b.title} className="group relative flex flex-col gap-4 rounded-lg border border-white/10 bg-white/[0.035] p-5">
            <div className="flex items-center gap-2 text-[0.6rem] font-medium tracking-[0.28em] text-cyan-300/80">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
              {b.tag}
            </div>
            <h3 className="text-sm font-semibold text-white sm:text-base">{b.title}</h3>
            <p className="text-xs leading-relaxed text-white/60 sm:text-sm">{b.text}</p>
            <span className="pointer-events-none absolute inset-0 rounded-lg ring-0 transition group-hover:ring-1 group-hover:ring-cyan-300/40" />
          </div>
        ))}
      </div>
    </section>
  );
}
