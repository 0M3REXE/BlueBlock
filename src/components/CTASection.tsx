export default function CTASection() {
  return (
    <section className="mx-auto max-w-5xl py-16 sm:py-20 md:py-28" id="get-started">
      <div className="rounded-xl border border-white/10 bg-[#032229]/60 px-5 py-10 text-center shadow-sm backdrop-blur-sm sm:rounded-2xl sm:px-8 sm:py-16">
        <h2 className="font-heading text-xl font-semibold tracking-tight text-white sm:text-2xl md:text-3xl">
          Ready to accelerate restoration impact?
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/65 sm:mt-4 sm:text-base">
          Join early adopters measuring and verifying blue carbon at scale. Start exploring the platform or become a verifier.
        </p>
        <div className="mt-6 flex flex-col gap-3 xs:flex-row xs:flex-wrap xs:justify-center sm:mt-8 sm:gap-4">
          <a href="#wallet" className="inline-flex items-center justify-center rounded-md bg-cyan-400/90 px-6 py-3 text-sm font-semibold tracking-wide text-[#062024] shadow hover:bg-cyan-300 sm:px-8">
            Launch App
          </a>
          <a href="#verifier" className="inline-flex items-center justify-center rounded-md border border-white/25 px-6 py-3 text-sm font-medium text-white/75 transition hover:border-white/45 hover:text-white sm:px-8">
            Become a Verifier
          </a>
        </div>
      </div>
    </section>
  );
}
