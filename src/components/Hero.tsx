interface HeroProps {
  className?: string;
}

export default function Hero({ className = "" }: HeroProps) {
  return (
    <section id="learn-more" className={`relative max-w-3xl pt-2 ${className}`}>
      <div className="space-y-7">
        <h1 className="font-heading text-[2.35rem] font-semibold leading-tight tracking-tight text-white sm:text-5xl md:text-[3.05rem]">
          Decentralized MRV for
          <span className="block text-cyan-300">Blue Carbon</span>
        </h1>
        <p className="max-w-[600px] text-base leading-relaxed text-white/70 sm:text-lg">
          BlueBlock provides transparent, cryptographically verifiable Monitoring, Reporting & Verification for coastal ecosystem restoration. Generate trustworthy carbon data, unlock credit issuance, and accelerate nature-based climate action across India.
        </p>
        <div className="flex flex-wrap gap-3 pt-1">
          <a
            className="inline-flex items-center justify-center rounded-md bg-cyan-400/90 px-7 py-3 text-sm font-semibold tracking-wide text-[#062024] shadow hover:bg-cyan-300"
            href="#wallet"
          >
            Launch App
          </a>
          <a
            className="inline-flex items-center justify-center rounded-md border border-white/20 px-7 py-3 text-sm font-medium text-white/75 transition hover:border-white/40 hover:text-white"
            href="#verifier"
          >
            Become a Verifier
          </a>
        </div>
        <div className="mt-8 flex flex-wrap gap-4">
          {[
            { k: 'Projects', v: '24+' },
            { k: 'Hectares Tracked', v: '3,800+' },
            { k: 'tCO₂ Potential', v: '1.2M+' },
          ].map(b => (
            <div key={b.k} className="flex min-w-[150px] flex-col gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-xs">
              <span className="text-lg font-semibold text-white">{b.v}</span>
              <span className="text-[0.55rem] uppercase tracking-[0.35em] text-white/55">{b.k}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
