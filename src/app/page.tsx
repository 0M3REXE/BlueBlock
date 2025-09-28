import Image from "next/image";
import Hero from "../components/Hero";
import Navbar, { NavLink } from "../components/Navbar";

const NAV_LINKS: NavLink[] = [
  { label: "Vocabulary", href: "#" },
  { label: "Practice", href: "#" },
  { label: "Contact Us", href: "#" },
  { label: "About Us", href: "#" },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#011720] text-white">
      <Image
        src="/ocean-background.jpg"
        alt="Soft-focus ocean surface"
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#012a39]/80 via-[#01212c]/40 to-[#01161f]/90" />

      <section className="relative z-10 flex min-h-screen w-full flex-col border border-white/15 bg-white/10 px-4 py-12 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-[36px] sm:px-10 md:px-16">

        <div
          className="pointer-events-none absolute right-16 top-1/2 hidden -translate-y-1/2 rounded-full bg-cyan-300/40 blur-[140px] lg:block"
          style={{ width: "30rem", height: "30rem" }}
        />

  <div className="mx-auto flex w-full max-w-[1100px] flex-1 flex-col pt-16 pb-16">
          <Navbar links={NAV_LINKS} />
          <Hero className="mt-16" />
        </div>
      </section>
    </main>
  );
}
