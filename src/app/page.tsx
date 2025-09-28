import Hero from "../components/Hero";
import FeaturesSection from "../components/FeaturesSection";
import WorkflowSection from "../components/WorkflowSection";
import CTASection from "../components/CTASection";
import Navbar, { NavLink } from "../components/Navbar";

const NAV_LINKS: NavLink[] = [
  { label: "Organisation Dashboard", href: "#org" },
  { label: "Field Dashboard", href: "#field" },
  { label: "Verifier", href: "#verifier" },
  { label: "Connect Wallet", href: "#wallet" },
];

export default function Home() {
  return (
    <main className="relative min-h-dvh overflow-hidden text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[#021b23]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_35%,#07343f_0%,#021b23_55%,#01161d_100%)] opacity-[0.55]" />
      </div>

      <section className="relative z-10 mx-auto w-full max-w-6xl px-4 pt-6 sm:px-8 md:px-12 lg:px-14">
        <Navbar links={NAV_LINKS} />
        <div className="flex min-h-[calc(100dvh-5rem)] flex-col justify-center pb-10 pt-10 md:pt-14" id="hero">
          <Hero className="" />
        </div>
        <FeaturesSection />
        <WorkflowSection />
        <CTASection />
        <div className="pb-24" />
      </section>
    </main>
  );
}
