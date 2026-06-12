import React from 'react';
import { actions } from '../data/actions';
import ActionCard from '../components/ActionCard';
import ImpactCounter from '../components/ImpactCounter';

interface Act4Props {
  pledgedActions: number[];
  onTogglePledge: (actionId: number) => void;
  globalTotal: number | null;
}

/**
 * Act 4: THE ACTIONS — Pledge Wall
 * Grid of 12 action cards with pledge toggle, particle burst animation,
 * and live impact counter showing personal + global totals.
 */
const Act4Actions: React.FC<Act4Props> = ({ pledgedActions, onTogglePledge, globalTotal }) => {
  // Calculate personal savings from pledged actions
  const personalSaved = pledgedActions.reduce((sum, id) => {
    const action = actions.find((a) => a.id === id);
    return sum + (action?.kgSavedPerYear ?? 0);
  }, 0);

  return (
    <section className="act act-4" id="act-4" aria-label="The Actions - Pledge Wall">
      {/* Animated light rays */}
      {[20, 40, 60, 80].map((pos) => (
        <div
          key={pos}
          className="light-ray"
          style={{
            left: `${pos}%`,
            animationDelay: `${(pos / 80) * 2}s`,
          }}
          aria-hidden="true"
        />
      ))}

      <h2 className="act-4-heading">Small actions. Real math.</h2>
      <p className="act-4-subheading">Pledge one. Watch the numbers change.</p>

      <div className="actions-grid">
        {actions.map((action) => (
          <ActionCard
            key={action.id}
            action={action}
            isPledged={pledgedActions.includes(action.id)}
            onTogglePledge={onTogglePledge}
          />
        ))}
      </div>

      <ImpactCounter
        personalSaved={personalSaved}
        globalSaved={globalTotal}
      />
    </section>
  );
};

export default Act4Actions;
