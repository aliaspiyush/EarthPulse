import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { UserFootprint, GeminiResponse } from './types';
import ProgressDots from './components/ProgressDots';
import Act1Pulse from './acts/Act1Pulse';
import Act2Mirror from './acts/Act2Mirror';
import Act3Weight from './acts/Act3Weight';
import Act4Actions from './acts/Act4Actions';
import Act5Ripple from './acts/Act5Ripple';

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
  const [geminiResponse, setGeminiResponse] = useState<GeminiResponse | null>(null);
  const [geminiLoading, setGeminiLoading] = useState(false);
  const [geminiError, setGeminiError] = useState(false);
  const [pledgedActions, setPledgedActions] = useState<number[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Track which act is in view via IntersectionObserver
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
  }, []);

  const scrollToAct = useCallback((act: number) => {
    const el = document.getElementById(`act-${act}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleQuizComplete = useCallback((fp: UserFootprint) => {
    setFootprint(fp);
    // Auto-scroll to Act 3
    setTimeout(() => scrollToAct(3), 300);
  }, [scrollToAct]);

  const handleRestart = useCallback(() => {
    setFootprint(null);
    setGeminiResponse(null);
    setGeminiLoading(false);
    setGeminiError(false);
    setPledgedActions([]);
    scrollToAct(1);
    // Force page reload for clean quiz state
    setTimeout(() => window.location.reload(), 100);
  }, [scrollToAct]);

  return (
    <>
      <ProgressDots currentAct={currentAct} onDotClick={scrollToAct} />

      <div className="scroll-container" ref={scrollRef}>
        <Act1Pulse tier={footprint?.tier ?? null} />

        <Act2Mirror onComplete={handleQuizComplete} />

        <Act3Weight
          footprint={footprint}
          geminiResponse={geminiResponse}
          geminiLoading={geminiLoading}
          geminiError={geminiError}
          onGeminiResult={setGeminiResponse}
          onGeminiLoadingChange={setGeminiLoading}
          onGeminiErrorChange={setGeminiError}
        />

        <Act4Actions
          pledgedActions={pledgedActions}
          onPledgeChange={setPledgedActions}
        />

        <Act5Ripple
          totalKg={footprint?.totalKg ?? 0}
          tier={footprint?.tier ?? 'Aware Citizen'}
          pledgedActions={pledgedActions}
          geminiResponse={geminiResponse}
          onRestart={handleRestart}
        />
      </div>
    </>
  );
};

export default App;
