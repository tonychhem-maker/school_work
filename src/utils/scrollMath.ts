import type { AssemblyStage } from '../data/blackwellData';

export function clamp01(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

export function progressToFrameIndex(progress: number, totalFrames: number): number {
  if (totalFrames <= 1) return 0;
  const clamped = clamp01(progress);
  return Math.min(totalFrames - 1, Math.round(clamped * (totalFrames - 1)));
}

export function frameIndexToProgress(frameIndex: number, totalFrames: number): number {
  if (totalFrames <= 1) return 0;
  const clampedFrame = Math.min(totalFrames - 1, Math.max(0, frameIndex));
  return clampedFrame / (totalFrames - 1);
}

export function getActiveStageIndex(progress: number, stages: AssemblyStage[]): number {
  if (stages.length === 0) return -1;
  const p = clamp01(progress);
  for (let i = 0; i < stages.length; i++) {
    const stage = stages[i];
    const isLast = i === stages.length - 1;
    if (p >= stage.startProgress && (p < stage.endProgress || isLast)) {
      return i;
    }
  }
  return stages.length - 1;
}

export function getStageLocalProgress(progress: number, stage: AssemblyStage): number {
  const span = stage.endProgress - stage.startProgress;
  if (span <= 0) return 1;
  return clamp01((clamp01(progress) - stage.startProgress) / span);
}

export function lerpValue(current: number, target: number, factor: number): number {
  return current + (target - current) * clamp01(factor);
}

export function getFrameUrl(frameIndex: number): string {
  // ffmpeg %03d outputs 1-based frame_001.webp .. frame_240.webp
  const oneBased = Math.max(1, Math.round(frameIndex) + 1);
  return `/assets/frames/frame_${String(oneBased).padStart(3, '0')}.webp`;
}

export interface AllocationFormInput {
  email: string;
  platform: 'desktop' | 'laptop';
  region: string;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateAllocationForm(input: AllocationFormInput): ValidationResult {
  const trimmedEmail = input.email.trim();
  if (!trimmedEmail) {
    return { valid: false, error: 'Enter an email address to reserve launch updates.' };
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailPattern.test(trimmedEmail)) {
    return { valid: false, error: 'Enter a valid email address (e.g. alex@domain.com).' };
  }
  if (!input.region.trim()) {
    return { valid: false, error: 'Select a distribution region.' };
  }
  return { valid: true };
}
