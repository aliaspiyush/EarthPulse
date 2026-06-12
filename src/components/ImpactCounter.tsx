import React from 'react';

interface ImpactCounterProps {
  personalSaved: number;
  globalSaved: number | null;
}

/**
 * ImpactCounter — Sticky bottom bar showing personal and global pledge totals.
 * Displays "--" for global total when Supabase is unavailable.
 */
const ImpactCounter: React.FC<ImpactCounterProps> = ({
  personalSaved,
  globalSaved,
}) => {
  return (
    <div className="impact-counter" id="impact-counter" aria-live="polite">
      <span className="impact-stat impact-personal">
        Your pledged savings: {personalSaved.toLocaleString()} kg CO₂/yr
      </span>
      <span className="impact-stat impact-global">
        All users combined:{' '}
        {globalSaved !== null
          ? `${globalSaved.toLocaleString()} kg pledged`
          : '-- kg pledged'}
      </span>
    </div>
  );
};

export default ImpactCounter;
