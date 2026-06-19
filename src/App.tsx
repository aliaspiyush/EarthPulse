import React, { useState, useRef, useCallback, lazy, Suspense } from 'react';
import type { UserFootprint } from './types';
import ProgressDots from './components/ProgressDots';
import Act1Pulse from './acts/Act1Pulse';
import ErrorBoundary from './components/ErrorBoundary';
import { usePledges } from './hooks/usePledges';
import { useGemini } from './hooks/useGemini';
import { useActiveAct } from './hooks/useActiveAct';
import { ANIMATION_DURATIONS } from './utils/constants';

const Act2Mirror = lazy(() => import('./acts/Act2Mirror'));
const Act3Weight = lazy(() => import('./acts/Act3Weight'));
const Act4Actions = lazy(() => import('./acts/Act4Actions'));
const Act5Ripple = lazy(() => import('./acts/Act5Ripple'));

import './styles/globals.css';
import './styles/animations.css';
import './styles/acts.css';

/**
 * EARTHPULSE — Main Application
 * A scroll-snapped 5-act campaign experience for carbon footprint awareness.
 */
const App: React.FC = () => {
  const [currentAct, setCurrentAct] = useState(1);
  const [footprint, setFootprint] = useState<UserFootprint | null>(null);
  
  const { pledgedActions, setPledgedActions, globalTotal, handleTogglePledge } = usePledges();
  const {
    geminiResponse,
    geminiLoading,
    geminiError,
    fetchGeminiResponse,
    setGeminiResponse,
    setGeminiLoading,
    setGeminiError,
  } = useGemini();

  const scrollRef = useRef<HTMLDivElement>(null);

  // Track which act is in view
  useActiveAct(scrollRef, setCurrentAct);

  const scrollToAct = useCallback((act: number) => {
    const el = document.getElementById(`act-${act}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleQuizComplete = useCallback((fp: UserFootprint) => {
    setFootprint(fp);
    // Auto-scroll to Act 3
    setTimeout(() => scrollToAct(3), ANIMATION_DURATIONS.SCROLL_DELAY);
  }, [scrollToAct]);

  const handleRestart = useCallback(() => {
    setFootprint(null);
    setGeminiResponse(null);
    setGeminiLoading(false);
    setGeminiError(false);
    setPledgedActions([]);
    setCurrentAct(1);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, ANIMATION_DURATIONS.SCROLL_DELAY);
  }, [setGeminiResponse, setGeminiLoading, setGeminiError, setPledgedActions, setCurrentAct]);

  return (
    <>
      <ProgressDots currentAct={currentAct} onDotClick={scrollToAct} />

      <main className="scroll-container" ref={scrollRef}>
        <ErrorBoundary actName="Act1Pulse">
          <Act1Pulse tier={footprint?.tier ?? null} />
        </ErrorBoundary>

        <ErrorBoundary actName="Act2Mirror">
          <Suspense fallback={<div className="act" style={{ background: 'var(--earth-void)' }} />}>
            <Act2Mirror onComplete={handleQuizComplete} />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary actName="Act3Weight">
          <Suspense fallback={<div className="act" style={{ background: 'var(--earth-void)' }} />}>
            <Act3Weight
              footprint={footprint}
              geminiResponse={geminiResponse}
              geminiLoading={geminiLoading}
              geminiError={geminiError}
              fetchGeminiResponse={fetchGeminiResponse}
            />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary actName="Act4Actions">
          <Suspense fallback={<div className="act" style={{ background: 'var(--earth-void)' }} />}>
            <Act4Actions
              pledgedActions={pledgedActions}
              onTogglePledge={handleTogglePledge}
              globalTotal={globalTotal}
            />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary actName="Act5Ripple">
          <Suspense fallback={<div className="act" style={{ background: 'var(--earth-void)' }} />}>
            <Act5Ripple
              totalKg={footprint?.totalKg ?? 0}
              tier={footprint?.tier ?? 'Aware Citizen'}
              pledgedActions={pledgedActions}
              geminiResponse={geminiResponse}
              onRestart={handleRestart}
            />
          </Suspense>
        </ErrorBoundary>
      </main>
    </>
  );
};

export default App;
