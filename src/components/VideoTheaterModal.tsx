import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface VideoTheaterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VideoTheaterModal({ isOpen, onClose }: VideoTheaterModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const videoEl = videoRef.current;
    if (videoEl) {
      videoEl.currentTime = 0;
      void videoEl.play().catch(() => {
        // Autoplay may be restricted in headless contexts; user can press play manually
      });
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (videoEl) {
        videoEl.pause();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-theater-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl border border-white/15 bg-[#0A0A0C] p-4 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-[#76B900]">Hardware Engineering Film</p>
            <h2 id="video-theater-title" className="font-display text-lg font-bold text-white sm:text-xl">
              ROG Astral GeForce RTX 5090 — Complete Assembly Sequence
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close assembly film"
            className="inline-flex h-10 w-10 items-center justify-center border border-white/15 text-neutral-300 transition-colors hover:border-[#76B900] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#76B900]"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="relative aspect-video w-full overflow-hidden bg-black">
          <video
            ref={videoRef}
            src="/assets/aistudio/gemini_generated_video_493b475d_ccc16f68.mp4"
            controls
            playsInline
            preload="metadata"
            className="h-full w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}
