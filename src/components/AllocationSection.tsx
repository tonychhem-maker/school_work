import { useEffect, useState, type FormEvent } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { validateAllocationForm } from '../utils/scrollMath';

interface AllocationSectionProps {
  defaultPlatform: 'desktop' | 'laptop';
}

export function AllocationSection({ defaultPlatform }: AllocationSectionProps) {
  const [email, setEmail] = useState('');
  const [platform, setPlatform] = useState<'desktop' | 'laptop'>(defaultPlatform);

  useEffect(() => {
    setPlatform(defaultPlatform);
  }, [defaultPlatform]);
  const [region, setRegion] = useState('North America');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedRecord, setSubmittedRecord] = useState<{
    email: string;
    platform: 'desktop' | 'laptop';
    region: string;
  } | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = validateAllocationForm({ email, platform, region });
    if (!validation.valid) {
      setErrorMessage(validation.error ?? 'Please check your submission.');
      return;
    }
    setErrorMessage(null);
    setSubmittedRecord({ email: email.trim(), platform, region });
  };

  return (
    <>
      <section
        id="reserve"
        className="border-t border-white/[0.08] bg-[#050505] px-6 py-24"
      >
        <div className="mx-auto grid max-w-[1360px] grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-6">
            <p className="text-xs font-medium text-[#76B900]">Founders & Partner Allocation</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white text-balance sm:text-4xl">
              Reserve launch availability notifications
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-neutral-400">
              Receive direct regional inventory alerts for the ROG Astral GeForce RTX 5090 and
              Blackwell Max-Q laptop configurations as partner stock opens.
            </p>
          </div>

          <div className="border border-white/10 bg-[#0D0D0F] p-6 sm:p-8 lg:col-span-6">
            {submittedRecord ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-[#76B900]">
                  <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <h3 className="font-display text-lg font-bold text-white">
                    Allocation alert confirmed
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-neutral-300">
                  Registered <span className="font-mono text-white">{submittedRecord.email}</span> for{' '}
                  <span className="text-white">
                    {submittedRecord.platform === 'desktop'
                      ? 'ROG Astral GeForce RTX 5090'
                      : 'Blackwell RTX 5090 Laptops'}
                  </span>{' '}
                  updates in <span className="text-white">{submittedRecord.region}</span>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmittedRecord(null);
                    setEmail('');
                  }}
                  className="border border-white/20 px-4 py-2 text-xs font-medium text-neutral-200 transition-colors hover:border-[#76B900] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#76B900]"
                >
                  Register another configuration
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div>
                  <label htmlFor="allocation-email" className="block text-xs font-medium text-neutral-300">
                    Work or personal email
                  </label>
                  <input
                    id="allocation-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="alex@studio.com"
                    required
                    className="mt-2 w-full border border-white/15 bg-[#050505] px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:border-[#76B900] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="allocation-platform" className="block text-xs font-medium text-neutral-300">
                      Preferred configuration
                    </label>
                    <select
                      id="allocation-platform"
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value as 'desktop' | 'laptop')}
                      className="mt-2 w-full border border-white/15 bg-[#050505] px-4 py-3 text-sm text-white focus:border-[#76B900] focus:outline-none"
                    >
                      <option value="desktop">ROG Astral RTX 5090 (Desktop)</option>
                      <option value="laptop">Blackwell RTX 5090 (Laptop)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="allocation-region" className="block text-xs font-medium text-neutral-300">
                      Distribution region
                    </label>
                    <select
                      id="allocation-region"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="mt-2 w-full border border-white/15 bg-[#050505] px-4 py-3 text-sm text-white focus:border-[#76B900] focus:outline-none"
                    >
                      <option value="North America">North America</option>
                      <option value="Europe">Europe</option>
                      <option value="Asia Pacific">Asia Pacific</option>
                    </select>
                  </div>
                </div>

                {errorMessage && (
                  <p role="alert" className="text-xs font-medium text-rose-400">
                    {errorMessage}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#76B900] px-6 py-3.5 font-display text-xs font-bold tracking-[0.14em] text-black uppercase transition-colors hover:bg-[#89d400] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#76B900]"
                >
                  Request Launch Alert
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[0.08] bg-[#050505] px-6 py-10">
        <div className="mx-auto flex max-w-[1360px] flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <span className="font-display text-sm font-extrabold tracking-[0.2em] text-white">
              NVIDIA
            </span>
            <span aria-hidden="true" className="text-neutral-600">
              ·
            </span>
            <span className="text-xs text-neutral-400">
              Blackwell Architecture & ROG Astral RTX 5090 Showcase
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-neutral-400">
            <a href="#assembly" className="hover:text-white transition-colors">
              Assembly
            </a>
            <a href="#components" className="hover:text-white transition-colors">
              Components
            </a>
            <a href="#performance" className="hover:text-white transition-colors">
              Performance
            </a>
            <span>© 2026 NVIDIA Corporation</span>
          </div>
        </div>
      </footer>
    </>
  );
}
