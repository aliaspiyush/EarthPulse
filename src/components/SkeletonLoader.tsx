import React from 'react';

/**
 * SkeletonLoader — Shimmer loading state for the Gemini AI response.
 * Shows 3 skeleton lines with staggered widths.
 */
const SkeletonLoader: React.FC = () => {
  return (
    <div role="status" aria-label="Loading AI insights">
      <div className="skeleton-line" />
      <div className="skeleton-line" />
      <div className="skeleton-line" />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default SkeletonLoader;
