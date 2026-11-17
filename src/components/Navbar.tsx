import { Film } from 'lucide-react';

interface NavbarProps {
  onOpenFilm: () => void;
}

export function Navbar({ onOpenFilm }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 h-16 border-b border-white/[0.08] bg-[#050505]/85 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-[1360px] items-center justify-between gap-8 px-6">
        <a
          href="#top"
          className="font-display text-lg font-extrabold tracking-[0.22em] text-white transition-colors hover:text-[#76B900] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#76B900]"
        >
          NVIDIA
        </a>

        <nav aria-label="Primary" className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-300">
          <a
            href="#assembly"
            className="whitespace-nowrap shrink-0 py-1 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#76B900]"
          >
            Assembly
          </a>
          <a
            href="#components"
            className="whitespace-nowrap shrink-0 py-1 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#76B900]"
          >
            Components
          </a>
          <a
            href="#performance"
            className="whitespace-nowrap shrink-0 py-1 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#76B900]"
          >
            Performance
          </a>
          <a
            href="#reserve"
            className="whitespace-nowrap shrink-0 py-1 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#76B900]"
          >
            Reserve
          </a>
        </nav>

        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenFilm}
            className="inline-flex items-center gap-2 rounded-sm border border-[#76B900]/70 bg-[#76B900]/10 px-4 py-2 text-xs font-semibold tracking-wider text-white uppercase transition-colors hover:bg-[#76B900] hover:text-black whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#76B900]"
          >
            <Film className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Watch Film</span>
          </button>
        </div>
      </div>
    </header>
  );
}
