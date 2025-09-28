import Hero from "../components/Hero";
import Navbar, { NavLink } from "../components/Navbar";

const NAV_LINKS: NavLink[] = [
  { label: "Org Dashboard", href: "#org" },
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

      <section className="relative z-10 mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-4 pb-20 pt-6 sm:px-8 md:px-12 lg:px-14">

        <Navbar links={NAV_LINKS} />
  <Hero className="mt-12 flex-1" />
      </section>
    </main>
  );
}
