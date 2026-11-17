import test from 'node:test';
import assert from 'node:assert/strict';
import { ASSEMBLY_STAGES, TOTAL_VIDEO_FRAMES } from '../data/blackwellData';
import {
  clamp01,
  frameIndexToProgress,
  getActiveStageIndex,
  getFrameUrl,
  getStageLocalProgress,
  lerpValue,
  progressToFrameIndex,
  validateAllocationForm,
} from './scrollMath';

test('clamp01 bounds values and handles NaN safely', () => {
  assert.equal(clamp01(-0.5), 0);
  assert.equal(clamp01(0.42), 0.42);
  assert.equal(clamp01(1.8), 1);
  assert.equal(clamp01(Number.NaN), 0);
});

test('progressToFrameIndex maps normalized scroll progress across 240 frames', () => {
  assert.equal(progressToFrameIndex(0, TOTAL_VIDEO_FRAMES), 0);
  assert.equal(progressToFrameIndex(1, TOTAL_VIDEO_FRAMES), 239);
  assert.equal(progressToFrameIndex(0.5, TOTAL_VIDEO_FRAMES), 120);
  assert.equal(progressToFrameIndex(-1, TOTAL_VIDEO_FRAMES), 0);
  assert.equal(progressToFrameIndex(2, TOTAL_VIDEO_FRAMES), 239);
});

test('frameIndexToProgress reverses frame index cleanly', () => {
  assert.equal(frameIndexToProgress(0, 240), 0);
  assert.equal(frameIndexToProgress(239, 240), 1);
  assert.ok(Math.abs(frameIndexToProgress(120, 240) - 120 / 239) < 1e-9);
});

test('getActiveStageIndex resolves contiguous assembly stages including upper bound', () => {
  assert.equal(getActiveStageIndex(0, ASSEMBLY_STAGES), 0);
  assert.equal(getActiveStageIndex(0.25, ASSEMBLY_STAGES), 1);
  assert.equal(getActiveStageIndex(0.5, ASSEMBLY_STAGES), 2);
  assert.equal(getActiveStageIndex(0.75, ASSEMBLY_STAGES), 3);
  assert.equal(getActiveStageIndex(0.95, ASSEMBLY_STAGES), 4);
  assert.equal(getActiveStageIndex(1.0, ASSEMBLY_STAGES), 4);
});

test('getStageLocalProgress computes normalized progress within a stage', () => {
  const stage = ASSEMBLY_STAGES[1]; // 0.18 -> 0.42
  assert.equal(getStageLocalProgress(0.18, stage), 0);
  assert.ok(Math.abs(getStageLocalProgress(0.3, stage) - 0.5) < 1e-9);
  assert.equal(getStageLocalProgress(0.42, stage), 1);
});

test('lerpValue smoothly approaches target', () => {
  assert.equal(lerpValue(0, 10, 0.5), 5);
  assert.equal(lerpValue(10, 20, 1.5), 20);
});

test('getFrameUrl produces zero-padded 1-based WebP frame paths', () => {
  assert.equal(getFrameUrl(0), '/assets/frames/frame_001.webp');
  assert.equal(getFrameUrl(8), '/assets/frames/frame_009.webp');
  assert.equal(getFrameUrl(239), '/assets/frames/frame_240.webp');
});

test('validateAllocationForm rejects invalid emails and accepts valid submissions', () => {
  assert.equal(validateAllocationForm({ email: '', platform: 'desktop', region: 'North America' }).valid, false);
  assert.equal(validateAllocationForm({ email: 'not-an-email', platform: 'desktop', region: 'North America' }).valid, false);
  assert.equal(validateAllocationForm({ email: 'engineer@nvidia.com', platform: 'laptop', region: '' }).valid, false);
  assert.equal(validateAllocationForm({ email: 'engineer@nvidia.com', platform: 'desktop', region: 'North America' }).valid, true);
});
