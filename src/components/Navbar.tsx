"use client";

import { useState } from "react";
import WalletButton from "./WalletButton";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins-navbar",
});

export type NavLink = {
  label: string;
  href: string;
};

interface NavbarProps {
  links: NavLink[];
  className?: string;
}

export default function Navbar({ links, className = "" }: NavbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`sticky top-4 z-40 mx-auto w-full max-w-5xl px-3 ${className} ${poppins.variable}`}>
  <header className="relative flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-[#032229]/85 px-4 py-3 text-sm text-white/75 shadow-sm backdrop-blur-sm sm:px-6">
        <a href="#top" className="group flex items-center gap-2">
          <span className="font-heading text-lg font-semibold uppercase tracking-[0.32em] text-white/85 transition-colors group-hover:text-white">BlueBlock</span>
        </a>

    <button
      aria-label="Toggle navigation"
      className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] text-white/70 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60 lg:hidden"
      onClick={() => setOpen(o => !o)}
    >
          <span className="sr-only">Menu</span>
          <div className="flex flex-col gap-[6px]">
            {[0,1,2].map(i => (
              <span
                key={i}
                className={`block h-[2px] w-5 origin-center rounded-full bg-current transition-all duration-300 ${
                  open
                    ? i === 1
                      ? 'scale-x-0 opacity-0'
                      : i === 0
                        ? 'translate-y-[8px] rotate-45'
                        : '-translate-y-[8px] -rotate-45'
                    : ''
                }`}
              />
            ))}
          </div>
        </button>

        <nav aria-label="Primary" className="hidden items-center gap-5 lg:flex">
          <ul className="flex items-center gap-6 text-[0.7rem] font-medium tracking-[0.20em] text-white/85" style={{ fontFamily: 'var(--font-poppins-navbar)' }}>
            {links.filter(l => !/wallet/i.test(l.label)).map(({ label, href }) => (
              <li key={label} className="transition-colors duration-150 hover:text-white">
                <a className="cursor-pointer select-none" href={href}>{label}</a>
              </li>
            ))}
          </ul>
          <WalletButton className="ml-2" />
        </nav>

        {open && (
          <div className="absolute left-0 top-full mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-[#032229]/95 p-4 shadow-lg backdrop-blur-sm lg:hidden">
            <ul className="flex flex-col gap-2.5 text-[0.75rem] font-medium tracking-[0.22em] text-white/80" style={{ fontFamily: 'var(--font-poppins-navbar)' }}>
              {links.filter(l => !/wallet/i.test(l.label)).map(({ label, href }) => (
                <li key={label}>
                  <a
                    onClick={() => setOpen(false)}
                    href={href}
                    className="block rounded-xl px-4 py-3 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    {label}
                  </a>
                </li>
              ))}
              <li className="pt-2"><WalletButton className="w-full justify-center rounded-xl px-4 py-3 text-[0.75rem]" /></li>
            </ul>
          </div>
        )}
      </header>
    </div>
  );
}
