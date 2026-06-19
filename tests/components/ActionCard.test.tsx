import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ActionCard from '../../src/components/ActionCard';

const mockAction = {
  id: 1,
  emoji: '🚶',
  title: 'Walk',
  description: 'Walk more',
  kgSavedPerYear: 350,
  source: 'Source',
};

describe('ActionCard Component', () => {
  it('should render action details correctly', () => {
    render(
      <ActionCard
        action={mockAction}
        isPledged={false}
        onTogglePledge={vi.fn()}
      />
    );

    expect(screen.getByText('Walk')).toBeInTheDocument();
    expect(screen.getByText('Walk more')).toBeInTheDocument();
    expect(screen.getByText('Saves ~350 kg/yr')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Pledge' })).toBeInTheDocument();
  });

  it('should display "Pledged" when isPledged is true', () => {
    render(
      <ActionCard
        action={mockAction}
        isPledged={true}
        onTogglePledge={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: '✓ Pledged' })).toBeInTheDocument();
  });

  it('should call onTogglePledge when clicked', () => {
    const handleToggle = vi.fn();
    render(
      <ActionCard
        action={mockAction}
        isPledged={false}
        onTogglePledge={handleToggle}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Pledge' }));
    expect(handleToggle).toHaveBeenCalledWith(1);
  });
});
