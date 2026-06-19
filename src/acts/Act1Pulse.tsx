import React, { useState, useEffect } from 'react';
import type { Tier } from '../types';
import StarField from '../components/StarField';
import EarthOrb from '../components/EarthOrb';

interface Act1Props {
  tier: Tier;
}

/**
 * Act 1: THE PULSE — Hero Screen
 * Deep space background with twinkling stars, breathing Earth orb,
 * headline reveal animation, live CO₂ counter, and scroll indicator.
 */
const Act1Pulse: React.FC<Act1Props> = ({ tier }) => {
  // Source: NOAA GML, approx mid-2024 baseline
  const [co2, setCo2] = useState(424.5);

  useEffect(() => {
    // Tick up 0.0001 ppm every 2 seconds to simulate real-time increase
    const interval = setInterval(() => {
      setCo2((prev) => {
        const next = prev + 0.0001;
        return Math.round(next * 10000) / 10000;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="act act-1" id="act-1" aria-label="The Pulse - Hero">
      <StarField />

      <div className="hero-content">
        <EarthOrb tier={tier} size={320} />

        <h1 className="hero-headline">The planet is breathing.</h1>
        <p className="hero-subheadline">Find out how you're affecting it.</p>
      </div>

      <div className="co2-pill" id="co2-counter">
        <span className="co2-pill-text">
          <span aria-hidden="true">🌍</span> Atmospheric CO₂:{' '}
          <span className="co2-pill-value">{co2.toFixed(4)} ppm</span>
        </span>
      </div>

      <div className="scroll-indicator">
        Discover your impact ↓
      </div>
    </section>
  );
};

export default Act1Pulse;
