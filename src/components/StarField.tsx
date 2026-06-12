import React, { useState } from 'react';

interface Star {
  id: number;
  top: string;
  left: string;
  size: number;
  delay: string;
  duration: string;
}

/**
 * StarField — 200 twinkling star dots for the Act 1 deep-space background.
 * Uses useEffect to generate random positions once on mount,
 * preventing re-randomization and keeping render pure.
 */
const StarField: React.FC = () => {
  const [stars] = useState<Star[]>(() =>
    Array.from({ length: 200 }, (_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 1.5 + 0.5, // 0.5px to 2px
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 3 + 2}s`, // 2-5s twinkling
    }))
  );

  return (
    <div className="star-field" aria-hidden="true">
      {stars.map((star) => (
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
