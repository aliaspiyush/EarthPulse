import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import QuizCard from '../../src/components/QuizCard';

const mockQuestion = {
  id: 1,
  question: 'How do you commute?',
  answers: [
    { text: 'Walk', kgPerYear: 0 },
    { text: 'Car', kgPerYear: 2400 },
  ],
};

describe('QuizCard Component', () => {
  it('should render the question and answers correctly', () => {
    render(
      <QuizCard
        question={mockQuestion}
        questionIndex={0}
        totalQuestions={7}
        onAnswer={vi.fn()}
      />
    );

    expect(screen.getByText('How do you commute?')).toBeInTheDocument();
    expect(screen.getByText('1 / 7')).toBeInTheDocument();
    expect(screen.getByText('Walk')).toBeInTheDocument();
    expect(screen.getByText('Car')).toBeInTheDocument();
  });

  it('should call onAnswer when an option is clicked', () => {
    const handleAnswer = vi.fn();
    render(
      <QuizCard
        question={mockQuestion}
        questionIndex={0}
        totalQuestions={7}
        onAnswer={handleAnswer}
      />
    );

    const btn = screen.getByText('Walk');
    fireEvent.click(btn);

    expect(handleAnswer).toHaveBeenCalledWith(
      { questionId: 1, selectedIndex: 0, kgValue: 0 },
      'How do you commute?',
      'Walk'
    );
  });

  it('should disable buttons after selection', () => {
    render(
      <QuizCard
        question={mockQuestion}
        questionIndex={0}
        totalQuestions={7}
        onAnswer={vi.fn()}
      />
    );

    const btn = screen.getByText('Walk');
    fireEvent.click(btn);

    expect(btn).toBeDisabled();
    expect(screen.getByText('Car')).toBeDisabled();
  });

  it('should render microResponse when provided', () => {
    render(
      <QuizCard
        question={mockQuestion}
        questionIndex={0}
        totalQuestions={7}
        onAnswer={vi.fn()}
        microResponse="Great choice!"
      />
    );

    expect(screen.getByText('Great choice!')).toBeInTheDocument();
  });
});
