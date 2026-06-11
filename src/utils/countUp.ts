/**
 * requestAnimationFrame-based count-up utility.
 * Provides smooth 60fps counting animation.
 */
export function animateCountUp(
  from: number,
  to: number,
  duration: number,
  onUpdate: (value: number) => void,
  onComplete?: () => void
): () => void {
  const startTime = performance.now();
  let animationId: number;

  function easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
  }

  function tick(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutCubic(progress);
    const currentValue = Math.floor(from + (to - from) * easedProgress);

    onUpdate(currentValue);

    if (progress < 1) {
      animationId = requestAnimationFrame(tick);
    } else {
      onUpdate(to);
      onComplete?.();
    }
  }

  animationId = requestAnimationFrame(tick);

  // Return cancel function
  return () => cancelAnimationFrame(animationId);
}
