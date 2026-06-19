import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { animateCountUp } from '../src/utils/countUp';

describe('animateCountUp', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should animate from start to end', () => {
    const onUpdate = vi.fn();
    const onComplete = vi.fn();
    
    // Simulate requestAnimationFrame
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      setTimeout(() => cb(performance.now()), 16);
      return 1;
    });

    animateCountUp(0, 100, 100, onUpdate, onComplete);

    vi.advanceTimersByTime(150); // Advance past duration

    expect(onUpdate).toHaveBeenCalledWith(100);
    expect(onComplete).toHaveBeenCalled();
  });
});
