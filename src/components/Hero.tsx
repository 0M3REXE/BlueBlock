interface HeroProps {
  className?: string;
}

export default function Hero({ className = "" }: HeroProps) {
  return (
    <section id="learn-more" className={`relative max-w-5xl ${className}`}>
      <div className="flex flex-col gap-8 sm:gap-10">
        {/* Content region */}
        <div className="flex flex-col gap-6 sm:gap-8">
          <div className="space-y-5 sm:space-y-6">
            <h1 className="font-heading text-[2rem] font-semibold leading-[1.1] tracking-tight text-white sm:text-[2.6rem] md:text-[3.1rem] lg:text-[3.35rem]">
              Decentralized MRV for
              <span className="block text-cyan-300">Blue Carbon</span>
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-white/70 sm:text-base lg:text-[1.05rem]">
              BlueBlock provides transparent, cryptographically verifiable Monitoring, Reporting & Verification for coastal ecosystem restoration. Generate trustworthy carbon data, unlock credit issuance, and accelerate nature-based climate action across India.
            </p>
            <div className="flex flex-col gap-3 pt-1 xs:flex-row xs:flex-wrap">
              <a
                className="inline-flex items-center justify-center rounded-md bg-cyan-400/90 px-6 py-3 text-sm font-semibold tracking-wide text-[#062024] shadow hover:bg-cyan-300 sm:px-7"
                href="#wallet"
              >
                Launch App
              </a>
              <a
                className="inline-flex items-center justify-center rounded-md border border-white/20 px-6 py-3 text-sm font-medium text-white/75 transition hover:border-white/40 hover:text-white sm:px-7"
                href="#verifier"
              >
                Become a Verifier
              </a>
            </div>
            {/* Stats moved below buttons */}
            <div className="mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:mt-10 sm:grid-cols-4 sm:gap-4">
              {[
                { k: 'Projects', v: '24+' },
                { k: 'Hectares Tracked', v: '3,800+' },
                { k: 'tCO₂ Potential', v: '1.2M+' },
                { k: 'Regions', v: '5' },
              ].map(b => (
                <div key={b.k} className="flex flex-col gap-1 rounded-lg border border-white/10 bg-white/[0.035] px-3 py-3 text-xs sm:px-4 sm:py-4">
                  <span className="text-lg font-semibold text-white sm:text-xl">{b.v}</span>
                  <span className="text-[0.5rem] uppercase tracking-[0.3em] text-white/55 sm:text-[0.55rem] sm:tracking-[0.35em]">{b.k}</span>
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
