import Image from "next/image";

interface HeroProps {
  className?: string;
}

export default function Hero({ className = "" }: HeroProps) {
  return (
    <section
      id="learn-more"
      className={`grid gap-12 lg:grid-cols-[minmax(0,520px)_minmax(280px,1fr)] lg:items-center ${className}`}
    >
      <div className="space-y-8">
        <h1 className="font-heading text-[2.8rem] uppercase leading-[1.1] drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)] sm:text-5xl md:text-[3.5rem]">
          An English nursery for young people
        </h1>
        <p className="text-base font-medium leading-relaxed tracking-[0.09em] text-white/85 sm:text-lg">
          Create a useful educational playground to help children learn English well. In addition, there are creative games to help improve the thinking skills of young children.
        </p>
        <div>
          <a
            className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-lg font-semibold tracking-[0.1em] text-[#021a22] shadow-[0_12px_25px_rgba(0,0,0,0.25)] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_30px_rgba(0,0,0,0.28)]"
            href="#learn-more"
          >
            Learn now
          </a>
        </div>
      </div>
      <div className="relative mx-auto flex h-[260px] w-[90%] max-w-[420px] items-end lg:h-[340px] lg:w-full">
        <div className="absolute -left-10 -top-6 h-16 w-16 rounded-full border border-white/40 bg-white/20" />
        <div className="absolute left-16 top-6 h-10 w-10 rounded-full border border-white/35" />
        <div className="absolute left-28 top-14 h-6 w-6 rounded-full border border-white/30" />
        <Image
          src="/whale.svg"
          alt="Smiling whale floating with bubbles"
          fill
          sizes="(max-width: 1024px) 70vw, 420px"
          className="object-contain"
          priority
        />
      </div>
    </section>
  );
}
