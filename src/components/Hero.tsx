interface HeroProps {
  className?: string;
}

export default function Hero({ className = "" }: HeroProps) {
  return (
    <section id="learn-more" className={`relative max-w-5xl ${className}`}>
      <div className="flex flex-col gap-10">
        {/* Content region */}
        <div className="flex flex-col gap-8">
          <div className="space-y-6">
            <h1 className="font-heading text-[2.6rem] font-semibold leading-[1.07] tracking-tight text-white sm:text-[3.1rem] md:text-[3.35rem]">
              Decentralized MRV for
              <span className="block text-cyan-300">Blue Carbon</span>
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-white/70 sm:text-[1.05rem]">
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
            {/* Stats moved below buttons */}
            <div className="mt-10 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { k: 'Projects', v: '24+' },
                { k: 'Hectares Tracked', v: '3,800+' },
                { k: 'tCO₂ Potential', v: '1.2M+' },
                { k: 'Regions', v: '5' },
              ].map(b => (
                <div key={b.k} className="flex flex-col gap-1 rounded-lg border border-white/10 bg-white/[0.035] px-4 py-4 text-xs">
                  <span className="text-xl font-semibold text-white">{b.v}</span>
                  <span className="text-[0.55rem] uppercase tracking-[0.35em] text-white/55">{b.k}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
    </section>
  );
}
