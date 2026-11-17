import { ArrowUpRight } from 'lucide-react';
import { INTERNAL_COMPONENTS } from '../data/blackwellData';

interface ComponentDeepDiveProps {
  onInspectStage: (stageId: string) => void;
}

export function ComponentDeepDive({ onInspectStage }: ComponentDeepDiveProps) {
  return (
    <section
      id="components"
      className="border-t border-white/[0.08] bg-[#050505] px-6 py-24"
    >
      <div className="mx-auto max-w-[1360px]">
        <div className="max-w-2xl">
          <p className="text-xs font-medium text-[#76B900]">Internal Subsystem Architecture</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white text-balance sm:text-4xl">
            Five engineered layers beneath the shroud
          </h2>
          <p className="mt-4 text-base leading-relaxed text-neutral-400">
            Select any internal component below to jump directly to its assembly frame and inspect
            how silicon, power delivery, and thermal diffusion lock into one chassis.
          </p>
        </div>

        {/* Asymmetric Bento Grid following 2_landing_marketing.md §2.C */}
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {INTERNAL_COMPONENTS.map((component) => {
            const isWide = component.span === 'wide';
            return (
              <article
                key={component.id}
                className={`flex flex-col justify-between border border-white/10 bg-[#0D0D0F] p-6 transition-colors hover:border-white/25 sm:p-8 ${
                  isWide ? 'lg:col-span-2' : 'lg:col-span-1'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-4 text-xs text-neutral-400">
                    <span className="font-mono text-[#76B900] tabular-nums">
                      {component.index}. {component.category}
                    </span>
                    <button
                      type="button"
                      onClick={() => onInspectStage(component.stageId)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-neutral-300 transition-colors hover:text-[#76B900] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#76B900]"
                    >
                      <span>Inspect Layer</span>
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>

                  <h3 className="mt-3 font-display text-xl font-bold text-white sm:text-2xl">
                    {component.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-neutral-300">
                    {component.summary}
                  </p>

                  <p className="mt-3 text-xs leading-relaxed text-neutral-400">
                    {component.engineeringNote}
                  </p>
                </div>

                <dl
                  className={`mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-5 ${
                    component.specs.length === 4 ? 'sm:grid-cols-4' : 'sm:grid-cols-3'
                  }`}
                >
                  {component.specs.map((spec) => (
                    <div key={spec.label}>
                      <dt className="text-[11px] text-neutral-400">{spec.label}</dt>
                      <dd className="mt-1 font-mono text-sm font-semibold text-white tabular-nums whitespace-nowrap">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
