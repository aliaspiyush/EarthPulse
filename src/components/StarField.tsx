import React from 'react';

interface Star {
  id: number;
  top: string;
  left: string;
  size: number;
  delay: string;
  duration: string;
}

const STAR_POSITIONS: Star[] = Array.from({ length: 200 }, (_, i) => ({
  id: i,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  size: Math.random() > 0.8 ? 2 : 1, // 1px or 2px
  delay: `${Math.random() * 4}s`,
  duration: `${Math.random() * 3 + 2}s`, // 2-5s twinkling
}));

/**
 * StarField — 200 twinkling star dots for the Act 1 deep-space background.
 * Uses a module-level constant to compute positions exactly once.
 */
const StarField: React.FC = () => {
  return (
    <div className="star-field" aria-hidden="true">
      {STAR_POSITIONS.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            animationDelay: star.delay,
            animationDuration: star.duration,
          }}
        />
      ))}
    </div>
  );
};

export default React.memo(StarField);
