interface FeatureItem {
  title: string;
  desc: string;
}

const FEATURES: FeatureItem[] = [
  {
    title: "On-chain Proofs",
    desc: "Immutable attestations for restoration events and carbon observations.",
  },
  {
    title: "Sensor + Field Data",
    desc: "Combine satellite, drone, and in-situ measurements in one timeline.",
  },
  {
    title: "Automated Reporting",
    desc: "Generate verifier-ready MRV packets with one click.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="mx-auto max-w-5xl py-16 sm:py-20 md:py-24" id="features">
      <div className="mb-8 flex flex-col gap-2 sm:mb-12 sm:gap-3">
        <h2 className="font-heading text-xl font-semibold tracking-tight text-white sm:text-2xl md:text-3xl">Platform Features</h2>
        <p className="max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base">
          A focused toolkit to bring trust and transparency to coastal blue carbon restoration projects.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {FEATURES.map(f => (
          <div key={f.title} className="flex flex-col gap-2.5 rounded-lg border border-white/10 bg-white/[0.035] p-4 sm:gap-3 sm:p-5">
            <h3 className="text-sm font-medium text-white sm:text-base">{f.title}</h3>
            <p className="text-xs leading-relaxed text-white/60 sm:text-sm">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
