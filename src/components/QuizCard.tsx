import React, { useState, useCallback } from 'react';
import type { QuizQuestion, QuizAnswer } from '../types';
import EarthOrb from './EarthOrb';

interface QuizCardProps {
  question: QuizQuestion;
  questionIndex: number;
  totalQuestions: number;
  onAnswer: (answer: QuizAnswer) => void;
}

/**
 * QuizCard — Single quiz question card with animated answer pills.
 * Shows a mini Earth orb that flashes green/red on answer selection.
 */
const QuizCard: React.FC<QuizCardProps> = ({
  question,
  questionIndex,
  totalQuestions,
  onAnswer,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [flashClass, setFlashClass] = useState<string>('');

  // Determine if an answer is "good" (low carbon) or "bad" (high carbon)
  // Using median of all answer values as threshold
  const getAnswerQuality = useCallback(
    (answerKg: number): 'good' | 'bad' => {
      const values = question.answers.map((a) => a.kgPerYear);
      const sorted = [...values].sort((a, b) => a - b);
      const median =
        sorted.length % 2 === 0
          ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
          : sorted[Math.floor(sorted.length / 2)];
      return answerKg <= median ? 'good' : 'bad';
    },
    [question]
  );

  const handleSelect = (index: number) => {
    if (selectedIndex !== null) return; // Already answered

    const answer = question.answers[index];
    const quality = getAnswerQuality(answer.kgPerYear);

    setSelectedIndex(index);

    // Flash the mini earth
    setFlashClass(quality === 'good' ? 'flash-green-anim' : 'flash-red-anim');
    setTimeout(() => setFlashClass(''), 500);

    // Delay to show selection feedback before advancing
    setTimeout(() => {
      onAnswer({
        questionId: question.id,
        selectedIndex: index,
        kgValue: answer.kgPerYear,
      });
    }, 600);
  };

  return (
    <div className="quiz-card" key={question.id}>
      <div className="quiz-card-header">
        <div style={{ flex: 1 }}>
          <span className="quiz-counter">
            {questionIndex + 1} / {totalQuestions}
          </span>
          <h2 className="quiz-question">{question.question}</h2>
        </div>
        <div className="mini-earth-container">
          <EarthOrb size={80} flashClass={flashClass} />
        </div>
      </div>

      <div className="quiz-answers">
        {question.answers.map((answer, idx) => {
          let className = 'quiz-answer';
          if (selectedIndex === idx) {
            const quality = getAnswerQuality(answer.kgPerYear);
            className += quality === 'good' ? ' selected-good' : ' selected-bad';
          }

          return (
            <button
              key={idx}
              className={className}
              onClick={() => handleSelect(idx)}
              disabled={selectedIndex !== null}
              type="button"
              id={`quiz-q${question.id}-a${idx}`}
            >
              {answer.text}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuizCard;
