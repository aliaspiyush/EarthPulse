import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { GeminiResponse, UserFootprint } from '../types';
import { callGemini } from '../utils/gemini';
import { animateCountUp } from '../utils/countUp';
import SkeletonLoader from '../components/SkeletonLoader';

interface Act3Props {
  footprint: UserFootprint | null;
  geminiResponse: GeminiResponse | null;
  geminiLoading: boolean;
  geminiError: boolean;
  onGeminiResult: (response: GeminiResponse) => void;
  onGeminiLoadingChange: (loading: boolean) => void;
  onGeminiErrorChange: (error: boolean) => void;
}

const CIRCUMFERENCE = 2 * Math.PI * 54; // ≈ 339.29

const TIER_COLORS: Record<string, string> = {
  EcoGuardian: '#52C41A',
  'Aware Citizen': '#4FC3F7',
  'Average Impact': '#FF6B35',
  'Heavy Footprint': '#FF5252',
};

const Act3Weight: React.FC<Act3Props> = ({
  footprint,
  geminiResponse,
  geminiLoading,
  onGeminiResult,
  onGeminiLoadingChange,
  onGeminiErrorChange,
}) => {
  const [displayNumber, setDisplayNumber] = useState(0);
  const [strokeOffset, setStrokeOffset] = useState(CIRCUMFERENCE);
  const hasCalledRef = useRef(false);
  const cancelCountRef = useRef<(() => void) | null>(null);

  const totalKg = footprint?.totalKg ?? 0;
  const tier = footprint?.tier ?? 'Aware Citizen';
  const tierColor = TIER_COLORS[tier] || '#4FC3F7';

  // Animate count-up
  useEffect(() => {
    if (!footprint) return;
    cancelCountRef.current?.();
    const cancel = animateCountUp(0, totalKg, 1500, (value) => {
      setDisplayNumber(value);
    });
    cancelCountRef.current = cancel;

    requestAnimationFrame(() => {
      const targetOffset = CIRCUMFERENCE - Math.min(totalKg / 20000, 1) * CIRCUMFERENCE;
      setStrokeOffset(targetOffset);
    });

    return () => cancel();
  }, [footprint, totalKg]);

  const triggerGemini = useCallback(
    async () => {
      if (!footprint || !footprint.tier || hasCalledRef.current) return;
      hasCalledRef.current = true;
      onGeminiLoadingChange(true);
      onGeminiErrorChange(false);
      try {
        const response = await callGemini(footprint.totalKg, footprint.tier);
        onGeminiResult(response);
      } catch {
        onGeminiErrorChange(true);
      } finally {
        onGeminiLoadingChange(false);
      }
    },
    [footprint, onGeminiResult, onGeminiLoadingChange, onGeminiErrorChange]
  );

  useEffect(() => {
    if (footprint && !hasCalledRef.current) {
      triggerGemini();
    }
  }, [footprint, triggerGemini]);

  // Source: Our World in Data, 2022 global average per capita ~4700 kg
  const globalAvgPercent = Math.min((4700 / 20000) * 100, 100);
  const userPercent = Math.min((totalKg / 20000) * 100, 100);

  if (!footprint) {
    return (
      <section className="act act-3" id="act-3" aria-label="The Weight">
        <div className="act-3-left">
          <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: "'Space Grotesk', sans-serif" }}>
            Complete the quiz to see your results
          </p>
        </div>
        <div className="act-3-right">
          <h2 className="gemini-heading">What that actually means.</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)' }}>
            Your personalized insights will appear here.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="act act-3" id="act-3" aria-label="The Weight - Your Impact">

      <div className="act-3-left">
        <div className="big-number" aria-live="polite">
          {displayNumber.toLocaleString()}
        </div>
        <div className="big-number-unit">kg CO₂ per year</div>

        <div className="radial-progress">
          <svg viewBox="0 0 120 120" width="120" height="120">
            <circle className="radial-progress-bg" cx="60" cy="60" r="54" />
            <circle
              className="radial-progress-bar"
              cx="60" cy="60" r="54"
              stroke={tierColor}
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={strokeOffset}
            />
            <text className="radial-progress-text" x="60" y="60">
              {tier}
            </text>
          </svg>
        </div>

        <div className="global-context">
          Global average: ~4,700 kg/person/year
          <div className="global-context-bar">
            <div
              className="global-context-user"
              style={{ width: `${userPercent}%`, backgroundColor: tierColor, opacity: 0.4 }}
            />
            <div
              className="global-context-marker"
              style={{ left: `${globalAvgPercent}%` }}
              title="Global average"
            />
          </div>
        </div>
      </div>

      <div className="act-3-right">
        <h2 className="gemini-heading">What that actually means.</h2>

        {geminiLoading && <SkeletonLoader />}

        {geminiResponse && !geminiLoading && (
          <>
            {geminiResponse.analogies.map((analogy, i) => (
              <div key={i} className="analogy-card" style={{ animationDelay: `${i * 0.3}s` }}>
                {analogy}
              </div>
            ))}
            <div className="one-change-card" style={{ animationDelay: '0.9s' }}>
              💡 One thing: {geminiResponse.oneChange}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Act3Weight;
