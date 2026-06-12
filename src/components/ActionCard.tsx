import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { ActionItem } from '../types';

interface ActionCardProps {
  action: ActionItem;
  isPledged: boolean;
  onTogglePledge: (actionId: number) => void;
}

/**
 * ActionCard — Individual pledge action card with particle burst animation.
 * Handles pledge/unpledge toggling with visual feedback.
 */
const ActionCard: React.FC<ActionCardProps> = ({
  action,
  isPledged,
  onTogglePledge,
}) => {
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; tx: number; ty: number }[]
  >([]);
  const btnRef = useRef<HTMLButtonElement>(null);
  const particleIdRef = useRef(0);

  const handlePledge = useCallback(() => {
    if (!isPledged && btnRef.current) {
      // Create particle burst on pledge
      const rect = btnRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const newParticles = Array.from({ length: 6 }, (_, i) => {
        particleIdRef.current += 1;
        const angle = (360 / 6) * i;
        const rad = (angle * Math.PI) / 180;
        const distance = 40 + Math.random() * 20;
        return {
          id: particleIdRef.current,
          x: centerX,
          y: centerY,
          tx: Math.cos(rad) * distance,
          ty: Math.sin(rad) * distance,
        };
      });

      setParticles(newParticles);
      // Clean up particles after animation
      setTimeout(() => setParticles([]), 700);
    }

    onTogglePledge(action.id);
  }, [isPledged, action.id, onTogglePledge]);

  // Clean up particle timeouts on unmount
  useEffect(() => {
    return () => {
      setParticles([]);
    };
  }, []);

  return (
    <div className={`action-card ${isPledged ? 'pledged' : ''}`}>
      <span className="action-emoji" aria-hidden="true">
        {action.emoji}
      </span>
      <h3 className="action-title">{action.title}</h3>
      <div className="action-saving" style={{ color: 'var(--bio-green)', fontFamily: "'Space Mono', monospace", fontSize: '13px', marginBottom: '8px' }}>
        Saves ~{action.kgSavedPerYear.toLocaleString()} kg/yr
      </div>
      <p className="action-desc">{action.description}</p>

      <div style={{ position: 'relative' }}>
        <button
          ref={btnRef}
          className={`pledge-btn ${isPledged ? 'pledged' : ''}`}
          onClick={handlePledge}
          type="button"
          id={`pledge-action-${action.id}`}
        >
          {isPledged ? '✓ Pledged' : 'Pledge'}
        </button>

        {/* Particle burst */}
        {particles.map((p) => {
          return (
            <div
              key={p.id}
              style={{
                position: 'absolute',
                left: p.x,
                top: p.y,
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#52C41A',
                pointerEvents: 'none',
                animation: 'particleBurst 0.6s ease-out forwards',
                transform: `translate(${p.tx}px, ${p.ty}px)`,
                opacity: 0,
                // Animate via keyframes
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ActionCard;
