import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}

/**
 * GlassCard — Reusable glassmorphism container component.
 * Applies frosted glass effect with backdrop blur.
 */
const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  style,
  id,
}) => {
  return (
    <div
      id={id}
      className={`glass ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default GlassCard;
