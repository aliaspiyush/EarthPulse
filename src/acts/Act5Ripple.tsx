import React, { useRef, useCallback } from 'react';
import type { Tier, GeminiResponse } from '../types';
import { actions } from '../data/actions';
import { generateShareImage } from '../utils/shareCard';
import EarthOrb from '../components/EarthOrb';
import SDGBadges from '../components/SDGBadges';
import { FALLBACK_ANALOGIES } from '../data/fallbacks';

interface Act5Props {
  totalKg: number;
  tier: NonNullable<Tier>;
  pledgedActions: number[];
  geminiResponse: GeminiResponse | null;
  onRestart: () => void;
}

// Tier badge configuration
const TIER_BADGES: Record<string, { emoji: string; color: string }> = {
  EcoGuardian: { emoji: '🌿', color: '#52C41A' },
  'Aware Citizen': { emoji: '🌍', color: '#4FC3F7' },
  'Average Impact': { emoji: '🌤️', color: '#FF6B35' },
  'Heavy Footprint': { emoji: '🔥', color: '#FF5252' },
};

/**
 * Act 5: THE RIPPLE — Result & Share
 * Final result card with tier badge, Earth orb showing tier state,
 * hope analogy, SDG badges, share functionality, and restart option.
 */
const Act5Ripple: React.FC<Act5Props> = ({
  totalKg,
  tier,
  pledgedActions,
  geminiResponse,
  onRestart,
}) => {
  const resultCardRef = useRef<HTMLDivElement>(null);

  const pledgedTotal = pledgedActions.reduce((sum, id) => {
    const action = actions.find((a) => a.id === id);
    return sum + (action?.kgSavedPerYear ?? 0);
  }, 0);

  const badge = TIER_BADGES[tier] || TIER_BADGES['Aware Citizen'];

  const handleShare = useCallback(async () => {
    if (resultCardRef.current) {
      await generateShareImage(resultCardRef.current);
    }
  }, []);

  return (
    <section className="act act-5" id="act-5" aria-label="The Ripple - Your Result">
      {/* Animated ocean wave layers */}
      <div className="wave-layer wave-1" aria-hidden="true" />
      <div className="wave-layer wave-2" aria-hidden="true" />
      <div className="wave-layer wave-3" aria-hidden="true" />

      <div className="result-card" ref={resultCardRef} id="result-card">
        {/* Tier Badge */}
        <div className={`tier-badge badge-${tier.replace(/\s+/g, '-').toLowerCase()}`}>
          <span>{badge.emoji}</span>
          <span>{tier}</span>
        </div>

        {/* Mini Earth showing tier state */}
        <EarthOrb size={80} tier={tier} />

        {/* Footprint Summary */}
        <p className="footprint-summary">
          Your footprint: {totalKg.toLocaleString()} kg CO₂/year
        </p>

        {pledgedTotal > 0 && (
          <p className="pledged-summary">
            You pledged to save {pledgedTotal.toLocaleString()} kg this year
          </p>
        )}

        {/* Hope Analogy */}
        <div className="hope-analogy">
          🌱 {geminiResponse?.hopeAnalogy || FALLBACK_ANALOGIES[tier]?.hopeAnalogy}
        </div>

        {/* SDG Badges */}
        <SDGBadges />

        {/* Share Button */}
        <button
          className="share-btn"
          onClick={handleShare}
          type="button"
          id="share-result-btn"
        >
          Share Your Result
        </button>

        {/* Restart */}
        <button
          className="restart-btn"
          onClick={onRestart}
          type="button"
          id="restart-quiz-btn"
        >
          ↩ Retake the quiz
        </button>
      </div>
    </section>
  );
};

export default Act5Ripple;
