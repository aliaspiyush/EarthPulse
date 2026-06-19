import React, { useState, useEffect, useRef } from 'react';
import type { GeminiResponse, UserFootprint, Tier } from '../types';
import { CO2_BASELINES } from '../utils/emissions';
import { ANIMATION_DURATIONS } from '../utils/constants';
import { animateCountUp } from '../utils/countUp';
import SkeletonLoader from '../components/SkeletonLoader';

interface Act3Props {
  footprint: UserFootprint | null;
  geminiResponse: GeminiResponse | null;
  geminiLoading: boolean;
  geminiError: boolean;
  fetchGeminiResponse: (totalKg: number, tier: NonNullable<Tier>) => Promise<void>;
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
  geminiError,
  fetchGeminiResponse,
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
    const cancel = animateCountUp(0, totalKg, ANIMATION_DURATIONS.COUNT_UP, (value) => {
      setDisplayNumber(value);
    });
    cancelCountRef.current = cancel;

    requestAnimationFrame(() => {
      const targetOffset = CIRCUMFERENCE - Math.min(totalKg / CO2_BASELINES.MAX_SCALE, 1) * CIRCUMFERENCE;
      setStrokeOffset(targetOffset);
    });

    return () => cancel();
  }, [footprint, totalKg]);

  useEffect(() => {
    if (footprint && footprint.tier && !hasCalledRef.current) {
      hasCalledRef.current = true;
      fetchGeminiResponse(footprint.totalKg, footprint.tier);
    }
  }, [footprint, fetchGeminiResponse]);

  // Source: Our World in Data, 2022 global average per capita ~4700 kg
  const globalAvgPercent = Math.min((CO2_BASELINES.GLOBAL_AVERAGE / CO2_BASELINES.MAX_SCALE) * 100, 100);
  const userPercent = Math.min((totalKg / CO2_BASELINES.MAX_SCALE) * 100, 100);

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

        {geminiError && !geminiLoading && (
          <div role="alert" className="error-banner" style={{ background: 'rgba(255,82,82,0.1)', color: '#FF5252', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            ⚠️ AI generation failed. Showing standard insights.
          </div>
        )}

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
