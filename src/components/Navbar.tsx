export type NavLink = {
  label: string;
  href: string;
};

interface NavbarProps {
  links: NavLink[];
}

export default function Navbar({ links }: NavbarProps) {
  return (
    <header className="flex flex-col gap-8 text-lg text-white/80 md:flex-row md:items-center md:justify-between">
      <div className="font-heading text-[1.85rem] uppercase tracking-[0.62em]">
        Oceans
        <span className="ml-3 text-base tracking-[0.42em] text-white/70">
          English
        </span>
      </div>
      <nav aria-label="Primary">
        <ul className="flex flex-wrap items-center gap-6 md:gap-10">
          {links.map(({ label, href }) => (
            <li
              key={label}
              className="font-medium capitalize tracking-[0.15em] transition-colors hover:text-white"
            >
              <a className="cursor-pointer select-none" href={href}>
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
