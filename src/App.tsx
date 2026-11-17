import { useCallback, useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ScrollAssemblyTheater } from './components/ScrollAssemblyTheater';
import { ComponentDeepDive } from './components/ComponentDeepDive';
import { PerformanceShowcase } from './components/PerformanceShowcase';
import { AllocationSection } from './components/AllocationSection';
import { VideoTheaterModal } from './components/VideoTheaterModal';

export default function App() {
  const [activePlatform, setActivePlatform] = useState<'desktop' | 'laptop'>('desktop');
  const [isFilmOpen, setIsFilmOpen] = useState(false);
  const [stageRequest, setStageRequest] = useState<{ stageId: string; nonce: number } | null>(null);

  const handleStartAssembly = useCallback(() => {
    const el = document.getElementById('assembly');
    el?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleSelectPlatformFromHero = useCallback((platform: 'desktop' | 'laptop') => {
    setActivePlatform(platform);
    const el = document.getElementById('performance');
    el?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleInspectStage = useCallback((stageId: string) => {
    setStageRequest({ stageId, nonce: Date.now() });
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-neutral-100">
      <Navbar onOpenFilm={() => setIsFilmOpen(true)} />

      <main>
        <HeroSection
          onSelectPlatform={handleSelectPlatformFromHero}
          onStartAssembly={handleStartAssembly}
        />

        <ScrollAssemblyTheater
          selectedStageRequest={stageRequest}
          onOpenFilm={() => setIsFilmOpen(true)}
        />

        <ComponentDeepDive onInspectStage={handleInspectStage} />

        <PerformanceShowcase
          activePlatform={activePlatform}
          onChangePlatform={setActivePlatform}
        />

        <AllocationSection defaultPlatform={activePlatform} />
      </main>

      <VideoTheaterModal isOpen={isFilmOpen} onClose={() => setIsFilmOpen(false)} />
    </div>
  );
}
