import Hero from "../components/Hero";
import FeaturesSection from "../components/FeaturesSection";
import WorkflowSection from "../components/WorkflowSection";
import AlgorandBenefitsSection from "../components/AlgorandBenefitsSection";
import CTASection from "../components/CTASection";
import Navbar from "../components/Navbar";
import { NAV_LINKS } from "../components/navLinks";

export default function Home() {
  return (
    <main className="relative min-h-dvh overflow-hidden text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[#021b23]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_35%,#07343f_0%,#021b23_55%,#01161d_100%)] opacity-[0.55]" />
      </div>

      <section className="relative z-10 mx-auto w-full max-w-6xl px-4 pt-4 sm:px-6 sm:pt-6 md:px-8 lg:px-12 xl:px-14">
        <Navbar links={NAV_LINKS} />
        <div className="flex min-h-[calc(100dvh-4rem)] flex-col justify-center pb-8 pt-8 sm:min-h-[calc(100dvh-5rem)] sm:pb-10 sm:pt-10 md:pt-14" id="hero">
          <Hero className="" />
        </div>
        <FeaturesSection />
        <WorkflowSection />
        <AlgorandBenefitsSection />
        <CTASection />
        <div className="pb-16 sm:pb-20 md:pb-24" />
      </section>
    </main>
  );
}
