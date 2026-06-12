import React, { useMemo } from 'react';
import type { Tier } from '../types';
import '../styles/animations.css';
import '../styles/earth-orb.css';

interface EarthOrbProps {
  tier?: Tier;
  size?: number;
  flashClass?: string;
}

/**
 * EarthOrb — The central visual metaphor of EARTHPULSE.
 * A CSS-only globe with rotating land/ocean radial gradients,
 * cloud overlay, and tier-driven atmospheric glow.
 */
const EarthOrb: React.FC<EarthOrbProps> = ({
  tier = null,
  size = 320,
  flashClass,
}) => {
  // Breathing speed changes based on user's carbon tier
  const breatheDuration = useMemo(() => {
    switch (tier) {
      case 'EcoGuardian': return '5s';
      case 'Aware Citizen': return '4s';
      case 'Average Impact': return '2.5s';
      case 'Heavy Footprint': return '1.5s';
      default: return '4s';
    }
  }, [tier]);

  // Tier-driven atmospheric color and style class
  const tierClass = useMemo(() => {
    switch (tier) {
      case 'EcoGuardian': return 'tier-guardian';
      case 'Aware Citizen': return 'tier-aware';
      case 'Average Impact': return 'tier-average';
      case 'Heavy Footprint': return 'tier-heavy';
      default: return 'tier-aware';
    }
  }, [tier]);

  return (
    <div
      className={`earth-orb ${tierClass} ${flashClass || ''}`}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        position: 'relative',
        animation: `earthBreathe ${breatheDuration} ease-in-out infinite`,
      }}
      role="img"
      aria-label={`Earth orb visualization${tier ? `, tier: ${tier}` : ''}`}
    >
      {/* Outer atmosphere ring (pseudo-element equivalent) */}
      <div className="earth-atmosphere" />

      <div style={{
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'inset -8px -8px 24px rgba(0,0,0,0.6), inset 4px 4px 16px rgba(255,255,255,0.1)'
      }}>
        {/* Rotating surface layer */}
        <div className="earth-surface" />

        {/* Cloud layer */}
        <div className="earth-clouds" />
      </div>
    </div>
  );
};

export default React.memo(EarthOrb);
