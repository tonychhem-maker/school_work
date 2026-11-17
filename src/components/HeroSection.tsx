import { ArrowDown } from 'lucide-react';

interface HeroSectionProps {
  onSelectPlatform: (platform: 'desktop' | 'laptop') => void;
  onStartAssembly: () => void;
}

export function HeroSection({ onSelectPlatform, onStartAssembly }: HeroSectionProps) {
  return (
    <section
      id="top"
      className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden bg-[#050505] px-6 py-16"
    >
      {/* Exploded GPU hardware backdrop directly from the assembly sequence */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <img
          src="/assets/frames/frame_001.webp"
          alt="Exploded view of the NVIDIA Blackwell ROG Astral RTX 5090 hardware layers"
          referrerPolicy="no-referrer"
          className="h-full w-full max-w-[1360px] object-contain opacity-65 sm:opacity-85"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_56%_36%_at_50%_46%,rgba(5,5,5,0.86)_0%,rgba(5,5,5,0.48)_62%,rgba(5,5,5,0.92)_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-[#050505]/70 via-transparent to-[#050505]"
        />
      </div>

      {/* Centered editorial lockup matching the NVIDIA Blackwell Architecture visual language */}
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
        <p className="font-display text-base font-bold tracking-[0.28em] text-[#76B900] uppercase sm:text-xl">
          NVIDIA
        </p>

        <h1 className="mt-2 font-display text-[clamp(2.6rem,7.2vw,5.75rem)] font-extrabold leading-[0.95] tracking-[0.06em] text-white uppercase text-balance">
          BLACKWELL
        </h1>

        <p className="mt-2 font-display text-xl font-light italic tracking-[0.28em] text-neutral-200 uppercase sm:text-3xl">
          ARCHITECTURE
        </p>

        <p className="mt-6 max-w-xl text-sm leading-relaxed text-neutral-300 sm:text-base">
          92.2 billion transistors, 32GB GDDR7 memory, and quad-axial vapor chamber cooling.
          Scroll to assemble the ROG Astral GeForce RTX 5090 layer by layer.
        </p>

        <button
          type="button"
          onClick={onStartAssembly}
          aria-label="Scroll to hardware assembly sequence"
          className="mt-8 inline-flex h-14 w-10 items-center justify-center rounded-full border border-white/30 bg-black/50 text-white transition-colors hover:border-[#76B900] hover:text-[#76B900] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#76B900]"
        >
          <ArrowDown className="h-4 w-4" aria-hidden="true" />
        </button>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <button
            type="button"
            onClick={() => onSelectPlatform('desktop')}
            className="min-w-[210px] border border-[#76B900] bg-black/75 px-6 py-3 font-display text-xs font-bold tracking-[0.16em] text-white uppercase transition-colors hover:bg-[#76B900] hover:text-black whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#76B900]"
          >
            ROG ASTRAL 5090
          </button>

          <button
            type="button"
            onClick={() => onSelectPlatform('laptop')}
            className="min-w-[210px] border border-white/35 bg-black/75 px-6 py-3 font-display text-xs font-bold tracking-[0.16em] text-[#76B900] uppercase transition-colors hover:border-[#76B900] hover:bg-[#76B900]/10 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#76B900]"
          >
            BLACKWELL LAPTOPS
          </button>
        </div>
      </div>
    </section>
  );
}
