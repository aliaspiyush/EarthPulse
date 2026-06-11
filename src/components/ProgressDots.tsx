import React from 'react';

interface ProgressDotsProps {
  currentAct: number;
  onDotClick: (act: number) => void;
}

/**
 * ProgressDots — Fixed left-edge navigation showing 5 dots.
 * The active Act's dot glows with the accent blue color.
 */
const ProgressDots: React.FC<ProgressDotsProps> = ({ currentAct, onDotClick }) => {
  const acts = [1, 2, 3, 4, 5];

  return (
    <nav className="progress-dots" aria-label="Section navigation">
      {acts.map((act) => (
        <button
          key={act}
          className={`progress-dot ${currentAct === act ? 'active' : ''}`}
          onClick={() => onDotClick(act)}
          aria-label={`Go to Act ${act}`}
          aria-current={currentAct === act ? 'step' : undefined}
          type="button"
        />
      ))}
    </nav>
  );
};

export default ProgressDots;
