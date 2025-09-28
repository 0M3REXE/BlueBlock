export default function CTASection() {
  return (
    <section className="mx-auto max-w-5xl py-28" id="get-started">
      <div className="rounded-2xl border border-white/10 bg-[#032229]/60 px-8 py-16 text-center shadow-sm backdrop-blur-sm">
        <h2 className="font-heading text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Ready to accelerate restoration impact?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base">
          Join early adopters measuring and verifying blue carbon at scale. Start exploring the platform or become a verifier.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a href="#wallet" className="inline-flex items-center justify-center rounded-md bg-cyan-400/90 px-8 py-3 text-sm font-semibold tracking-wide text-[#062024] shadow hover:bg-cyan-300">
            Launch App
          </a>
          <a href="#verifier" className="inline-flex items-center justify-center rounded-md border border-white/25 px-8 py-3 text-sm font-medium text-white/75 transition hover:border-white/45 hover:text-white">
            Become a Verifier
          </a>
        </div>
      </div>
    </section>
  );
}
