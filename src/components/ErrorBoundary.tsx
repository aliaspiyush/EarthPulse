import React from 'react';

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; actName: string },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn(`[EarthPulse] ${this.props.actName} error:`, error.message);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="act"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--earth-void)',
          }}
        >
          <p
            style={{
              color: 'var(--text-muted)',
              fontFamily: 'Space Grotesk',
            }}
          >
            Something went wrong. Please refresh.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
