import { PLATFORM_PROFILES } from '../data/blackwellData';

interface PerformanceShowcaseProps {
  activePlatform: 'desktop' | 'laptop';
  onChangePlatform: (platform: 'desktop' | 'laptop') => void;
}

export function PerformanceShowcase({
  activePlatform,
  onChangePlatform,
}: PerformanceShowcaseProps) {
  const profile = PLATFORM_PROFILES[activePlatform];

  return (
    <section
      id="performance"
      className="border-t border-white/[0.08] bg-[#070709] px-6 py-24"
    >
      <div className="mx-auto max-w-[1360px]">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-medium text-[#76B900]">Silicon & Thermal Proof</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white text-balance sm:text-4xl">
              {profile.name}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-neutral-400">
              {profile.tagline}
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Blackwell platform configurations"
            className="inline-flex border border-white/15 bg-[#0D0D0F] p-1 self-start lg:self-auto"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activePlatform === 'desktop'}
              onClick={() => onChangePlatform('desktop')}
              className={`px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#76B900] ${
                activePlatform === 'desktop'
                  ? 'bg-[#76B900] text-black'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              ROG Astral 5090
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activePlatform === 'laptop'}
              onClick={() => onChangePlatform('laptop')}
              className={`px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#76B900] ${
                activePlatform === 'laptop'
                  ? 'bg-[#76B900] text-black'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              Blackwell Laptops
            </button>
          </div>
        </div>

        {/* 4-Column Hardware Spec Strip */}
        <dl className="mt-10 grid grid-cols-1 gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-[#0D0D0F] p-5">
            <dt className="text-xs text-neutral-400">Graphics Processor</dt>
            <dd className="mt-1.5 font-mono text-sm font-semibold text-white tabular-nums">
              {profile.chip}
            </dd>
          </div>
          <div className="bg-[#0D0D0F] p-5">
            <dt className="text-xs text-neutral-400">Memory Subsystem</dt>
            <dd className="mt-1.5 font-mono text-sm font-semibold text-white tabular-nums">
              {profile.memory}
            </dd>
          </div>
          <div className="bg-[#0D0D0F] p-5">
            <dt className="text-xs text-neutral-400">Tensor Throughput</dt>
            <dd className="mt-1.5 font-mono text-sm font-semibold text-[#76B900] tabular-nums">
              {profile.aiTops}
            </dd>
          </div>
          <div className="bg-[#0D0D0F] p-5">
            <dt className="text-xs text-neutral-400">Power & Form Factor</dt>
            <dd className="mt-1.5 font-mono text-sm font-semibold text-white tabular-nums">
              {profile.powerEnvelope}
            </dd>
          </div>
        </dl>

        {/* Quantified Benchmark Comparison Bars */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {profile.benchmarks.map((item) => {
            const maxVal = Math.max(item.blackwellValue, item.prevGenValue);
            const blackwellWidth = Math.max(12, Math.round((item.blackwellValue / maxVal) * 100));
            const prevWidth = Math.max(12, Math.round((item.prevGenValue / maxVal) * 100));

            return (
              <div
                key={item.workload}
                className="border border-white/10 bg-[#0D0D0F] p-6"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-sm font-semibold text-white">{item.workload}</h3>
                  <span className="font-mono text-xs font-medium text-[#76B900] tabular-nums">
                    {item.deltaLabel}
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  <div>
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="text-neutral-200">Blackwell RTX 5090</span>
                      <span className="font-mono font-semibold text-white tabular-nums">
                        {item.blackwellValue} {item.unit}
                      </span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden bg-white/[0.06]">
                      <div
                        className="h-full origin-left bg-[#76B900] transition-transform duration-300"
                        style={{
                          transform: `scaleX(${blackwellWidth / 100})`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="text-neutral-400">Previous Generation (RTX 4090)</span>
                      <span className="font-mono text-neutral-400 tabular-nums">
                        {item.prevGenValue} {item.unit}
                      </span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden bg-white/[0.06]">
                      <div
                        className="h-full origin-left bg-neutral-600 transition-transform duration-300"
                        style={{
                          transform: `scaleX(${prevWidth / 100})`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
