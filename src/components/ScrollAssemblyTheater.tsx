import { useCallback, useEffect, useRef, useState } from 'react';
import { Crosshair, Film, Pause, Play } from 'lucide-react';
import { ASSEMBLY_STAGES, TOTAL_VIDEO_FRAMES } from '../data/blackwellData';
import {
  clamp01,
  frameIndexToProgress,
  getActiveStageIndex,
  getFrameUrl,
  lerpValue,
  progressToFrameIndex,
} from '../utils/scrollMath';

interface ScrollAssemblyTheaterProps {
  selectedStageRequest: { stageId: string; nonce: number } | null;
  onOpenFilm: () => void;
}

export function ScrollAssemblyTheater({
  selectedStageRequest,
  onOpenFilm,
}: ScrollAssemblyTheaterProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const framesRef = useRef<Array<HTMLImageElement | null>>(
    new Array(TOTAL_VIDEO_FRAMES).fill(null),
  );

  const targetProgressRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);
  const lastDrawnFrameRef = useRef<number>(-1);
  const isPlayingRef = useRef<boolean>(false);

  const [activeStageIdx, setActiveStageIdx] = useState<number>(0);
  const [displayedFrame, setDisplayedFrame] = useState<number>(0);
  const [scrollPercent, setScrollPercent] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [showHotspotDetail, setShowHotspotDetail] = useState<boolean>(true);
  const [loadedCount, setLoadedCount] = useState<number>(0);

  const drawFrameToCanvas = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Pick exact decoded frame or nearest available decoded neighbor to avoid blank flashes
    let img = framesRef.current[frameIdx];
    if (!img || !img.complete || img.naturalWidth === 0) {
      let bestDist = Infinity;
      for (let i = 0; i < TOTAL_VIDEO_FRAMES; i++) {
        const candidate = framesRef.current[i];
        if (candidate && candidate.complete && candidate.naturalWidth > 0) {
          const dist = Math.abs(i - frameIdx);
          if (dist < bestDist) {
            bestDist = dist;
            img = candidate;
          }
        }
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const targetW = Math.round(rect.width * dpr);
    const targetH = Math.round(rect.height * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Contain-fit framing with right-bias on wide desktop so the left HUD never obscures the GPU
    const isDesktop = rect.width >= 1024;
    const drawAreaW = isDesktop ? rect.width * 0.7 : rect.width * 0.96;
    const drawAreaH = rect.height * 0.86;
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const areaAspect = drawAreaW / drawAreaH;

    let renderW = drawAreaW;
    let renderH = drawAreaH;
    if (imgAspect > areaAspect) {
      renderH = drawAreaW / imgAspect;
    } else {
      renderW = drawAreaH * imgAspect;
    }

    const offsetX = isDesktop
      ? rect.width * 0.275 + (drawAreaW - renderW) / 2
      : (rect.width - renderW) / 2;
    const offsetY = (rect.height - renderH) / 2;

    ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
  }, []);

  // Preload milestone frames first, then fill all 240 frames progressively
  useEffect(() => {
    let cancelled = false;
    const priorityIndices: number[] = [];
    const remainingIndices: number[] = [];

    for (let i = 0; i < TOTAL_VIDEO_FRAMES; i++) {
      if (i % 8 === 0 || i === TOTAL_VIDEO_FRAMES - 1) {
        priorityIndices.push(i);
      } else {
        remainingIndices.push(i);
      }
    }

    const ordered = [...priorityIndices, ...remainingIndices];
    let cursor = 0;
    const CONCURRENCY = 6;

    const loadNext = () => {
      if (cancelled || cursor >= ordered.length) return;
      const idx = ordered[cursor++];
      const image = new Image();
      image.decoding = 'async';
      image.src = getFrameUrl(idx);
      image.onload = () => {
        if (cancelled) return;
        framesRef.current[idx] = image;
        setLoadedCount((prev) => prev + 1);
        if (idx === 0 || idx === lastDrawnFrameRef.current) {
          drawFrameToCanvas(lastDrawnFrameRef.current === -1 ? 0 : lastDrawnFrameRef.current);
        }
        loadNext();
      };
      image.onerror = () => {
        if (!cancelled) loadNext();
      };
    };

    for (let c = 0; c < CONCURRENCY; c++) {
      loadNext();
    }

    return () => {
      cancelled = true;
    };
  }, [drawFrameToCanvas]);

  // Keep canvas crisp on resize
  useEffect(() => {
    const handleResize = () => {
      const frame = lastDrawnFrameRef.current === -1 ? 0 : lastDrawnFrameRef.current;
      drawFrameToCanvas(frame);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawFrameToCanvas]);

  // Compute target scroll progress from the container's position in viewport
  const syncScrollProgress = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const scrollableDistance = Math.max(1, container.offsetHeight - window.innerHeight);
    const rawProgress = clamp01(-rect.top / scrollableDistance);
    if (!isPlayingRef.current) {
      targetProgressRef.current = rawProgress;
    }
  }, []);

  useEffect(() => {
    syncScrollProgress();
    const onScroll = () => {
      if (isPlayingRef.current) {
        // User manual scroll cancels auto-play smoothly
        isPlayingRef.current = false;
        setIsAutoPlaying(false);
      }
      syncScrollProgress();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [syncScrollProgress]);

  // Smooth RAF interpolation loop (respects prefers-reduced-motion)
  useEffect(() => {
    let rafId = 0;
    let lastTimestamp = performance.now();
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - lastTimestamp) / 1000);
      lastTimestamp = now;

      if (isPlayingRef.current) {
        // Advance at natural 10s duration (0.1 progress per second)
        const nextTarget = targetProgressRef.current + dt * 0.1;
        if (nextTarget >= 1) {
          targetProgressRef.current = 1;
          isPlayingRef.current = false;
          setIsAutoPlaying(false);
        } else {
          targetProgressRef.current = nextTarget;
        }
      }

      const smoothing = prefersReducedMotion || isPlayingRef.current ? 1 : 0.22;
      const nextCurrent = lerpValue(currentProgressRef.current, targetProgressRef.current, smoothing);
      currentProgressRef.current =
        Math.abs(targetProgressRef.current - nextCurrent) < 0.0005
          ? targetProgressRef.current
          : nextCurrent;

      const frameIdx = progressToFrameIndex(currentProgressRef.current, TOTAL_VIDEO_FRAMES);
      if (frameIdx !== lastDrawnFrameRef.current) {
        lastDrawnFrameRef.current = frameIdx;
        drawFrameToCanvas(frameIdx);
        setDisplayedFrame(frameIdx);
      }

      const stageIdx = getActiveStageIndex(currentProgressRef.current, ASSEMBLY_STAGES);
      setActiveStageIdx((prev) => (prev === stageIdx ? prev : stageIdx));

      const pct = Math.round(currentProgressRef.current * 100);
      setScrollPercent((prev) => (prev === pct ? prev : pct));

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [drawFrameToCanvas]);

  const jumpToStage = useCallback((stageId: string) => {
    const stage = ASSEMBLY_STAGES.find((s) => s.id === stageId);
    const container = containerRef.current;
    if (!stage || !container) return;

    isPlayingRef.current = false;
    setIsAutoPlaying(false);

    const targetProgress = frameIndexToProgress(stage.focusFrame, TOTAL_VIDEO_FRAMES);
    const containerTop = container.getBoundingClientRect().top + window.scrollY;
    const scrollableDistance = Math.max(1, container.offsetHeight - window.innerHeight);
    const targetScrollY = containerTop + targetProgress * scrollableDistance;

    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth',
    });
  }, []);

  useEffect(() => {
    if (!selectedStageRequest) return;
    jumpToStage(selectedStageRequest.stageId);
  }, [selectedStageRequest, jumpToStage]);

  const toggleAutoPlay = () => {
    if (isPlayingRef.current) {
      isPlayingRef.current = false;
      setIsAutoPlaying(false);
      return;
    }
    if (currentProgressRef.current >= 0.98) {
      currentProgressRef.current = 0;
      targetProgressRef.current = 0;
    }
    isPlayingRef.current = true;
    setIsAutoPlaying(true);
  };

  const activeStage = ASSEMBLY_STAGES[activeStageIdx] ?? ASSEMBLY_STAGES[0];
  const hotspotX = activeStage.hotspot.xPercent;
  const hotspotY = activeStage.hotspot.yPercent;

  return (
    <section
      id="assembly"
      aria-label="Scroll-driven GPU hardware assembly"
      ref={containerRef}
      className="relative h-[460vh] bg-[#050505]"
    >
      <div className="sticky top-16 flex h-[calc(100vh-4rem)] w-full flex-col justify-between overflow-hidden">
        {/* Hardware Frame Canvas */}
        <div className="absolute inset-0">
          <canvas
            ref={canvasRef}
            data-testid="assembly-canvas"
            data-frame={displayedFrame}
            data-stage={activeStage.id}
            aria-label={`GPU assembly frame ${displayedFrame + 1} of ${TOTAL_VIDEO_FRAMES}: ${activeStage.name}`}
            className="h-full w-full"
          />
          {/* Subtle perimeter vignette so the frame integrates seamlessly into obsidian canvas */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_60%_50%,transparent_48%,#050505_96%)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent"
          />
        </div>

        {/* Interactive Hardware Callout Pin anchored over active subsystem */}
        <div
          className="pointer-events-none absolute inset-0 z-10 hidden lg:block"
          aria-hidden={!showHotspotDetail}
        >
          <div
            style={{ left: `${hotspotX}%`, top: `${hotspotY}%` }}
            className="pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out"
          >
            <button
              type="button"
              onClick={() => setShowHotspotDetail((v) => !v)}
              aria-expanded={showHotspotDetail}
              aria-label={`Inspect ${activeStage.hotspot.label}`}
              className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-[#76B900] bg-black/80 text-[#76B900] backdrop-blur-sm transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#76B900]"
            >
              <Crosshair className="h-4 w-4" aria-hidden="true" />
            </button>

            {showHotspotDetail && (
              <div className="mt-2 w-60 border border-white/15 bg-[#0A0A0C]/92 p-3 backdrop-blur-md">
                <p className="text-xs font-semibold text-[#76B900]">{activeStage.hotspot.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-neutral-300">
                  {activeStage.hotspot.detail}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Top Theater Bar: Stage Counter + Playback Controls */}
        <div className="relative z-20 mx-auto flex w-full max-w-[1360px] items-center justify-between gap-4 px-6 pt-5">
          <div className="flex items-center gap-3 text-xs text-neutral-400">
            <span className="font-mono font-medium text-[#76B900] tabular-nums">
              {activeStage.index} / 0{ASSEMBLY_STAGES.length}
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-neutral-200">{activeStage.name}</span>
            {loadedCount < TOTAL_VIDEO_FRAMES && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-neutral-500 tabular-nums">
                  {Math.round((loadedCount / TOTAL_VIDEO_FRAMES) * 100)}% cached
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleAutoPlay}
              className="inline-flex items-center gap-2 border border-white/20 bg-black/70 px-3.5 py-2 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:border-[#76B900] hover:text-[#76B900] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#76B900]"
            >
              {isAutoPlaying ? (
                <>
                  <Pause className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Pause Assembly</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Auto-Assemble</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onOpenFilm}
              className="hidden sm:inline-flex items-center gap-2 border border-white/15 bg-black/70 px-3.5 py-2 text-xs font-medium text-neutral-300 backdrop-blur-sm transition-colors hover:border-white/40 hover:text-white whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#76B900]"
            >
              <Film className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Source Film</span>
            </button>
          </div>
        </div>

        {/* Left Editorial Stage Narrative & Specs */}
        <div className="relative z-20 mx-auto my-auto flex w-full max-w-[1360px] px-6 pointer-events-none">
          <div className="pointer-events-auto max-w-[356px] border border-white/10 bg-[#0A0A0C]/85 p-5 backdrop-blur-md">
            <p className="text-xs font-medium text-[#76B900]">
              Stage {activeStage.index} · {activeStage.subtitle}
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-white text-balance">
              {activeStage.name}
            </h2>
            <p className="mt-2.5 text-sm leading-relaxed text-neutral-300">
              {activeStage.description}
            </p>

            <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-white/10 pt-4">
              {activeStage.metrics.map((metric) => (
                <div key={metric.label}>
                  <dt className="text-[11px] text-neutral-400">{metric.label}</dt>
                  <dd className="mt-1 font-mono text-xs font-semibold text-white tabular-nums">
                    {metric.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Bottom Chapter Selector & Scrubbing Progress */}
        <div className="relative z-20 mx-auto w-full max-w-[1360px] px-6 pb-5">
          <div className="flex flex-col gap-3 border-t border-white/10 bg-[#050505]/85 pt-3 backdrop-blur-md">
            <div className="flex items-center justify-between gap-4">
              <div
                role="tablist"
                aria-label="Assembly stages"
                className="flex flex-1 items-center gap-2 overflow-x-auto pb-1 sm:gap-3"
              >
                {ASSEMBLY_STAGES.map((stage, idx) => {
                  const isActive = idx === activeStageIdx;
                  return (
                    <button
                      key={stage.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => jumpToStage(stage.id)}
                      className={`inline-flex items-center gap-2 border px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#76B900] ${
                        isActive
                          ? 'border-[#76B900] bg-[#76B900]/15 text-white'
                          : 'border-white/10 bg-transparent text-neutral-400 hover:border-white/30 hover:text-neutral-200'
                      }`}
                    >
                      <span className="font-mono text-[11px] text-[#76B900] tabular-nums">
                        {stage.index}
                      </span>
                      <span>{stage.shortLabel}</span>
                    </button>
                  );
                })}
              </div>

              <div className="hidden md:flex items-center gap-3 font-mono text-xs text-neutral-400 tabular-nums shrink-0">
                <span>Frame {String(displayedFrame + 1).padStart(3, '0')} / {TOTAL_VIDEO_FRAMES}</span>
                <span aria-hidden="true">·</span>
                <span className="text-white">{scrollPercent}%</span>
              </div>
            </div>

            {/* Compositor-only scaleX progress bar */}
            <div className="h-[2px] w-full overflow-hidden bg-white/10">
              <div
                className="h-full w-full origin-left bg-[#76B900] transition-transform duration-75"
                style={{ transform: `scaleX(${Math.max(0.01, scrollPercent / 100)})` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
