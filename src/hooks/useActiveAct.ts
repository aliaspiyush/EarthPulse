import { useEffect } from 'react';

/**
 * Hook to track which act is currently visible in the scroll container.
 * @param {React.RefObject<HTMLElement | null>} scrollRef - Ref to the scroll container.
 * @param {(act: number) => void} setCurrentAct - Callback to update the current act.
 */
export function useActiveAct(
  scrollRef: React.RefObject<HTMLElement | null>,
  setCurrentAct: (act: number) => void
) {
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const sections = container.querySelectorAll('.act');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            if (id) {
              const actNum = parseInt(id.replace('act-', ''), 10);
              if (!isNaN(actNum)) setCurrentAct(actNum);
            }
          }
        });
      },
      { root: container, threshold: 0.5 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [scrollRef, setCurrentAct]);
}
