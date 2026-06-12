import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { QuizQuestion, QuizAnswer } from '../types';
import { ANIMATION_DURATIONS } from '../utils/constants';
import EarthOrb from './EarthOrb';

interface QuizCardProps {
  question: QuizQuestion;
  questionIndex: number;
  totalQuestions: number;
  onAnswer: (answer: QuizAnswer, questionText: string, answerText: string) => void;
  microResponse?: string | null;
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
  microResponse,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [flashClass, setFlashClass] = useState<string>('');
  const firstOptionRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Focus the first option when the question changes (mounts)
    firstOptionRef.current?.focus();
  }, [question.id]);

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
    setTimeout(() => setFlashClass(''), ANIMATION_DURATIONS.CARD_FLASH);

    // No setTimeout here anymore, useQuiz handles the delay and async fetch
    onAnswer(
      {
        questionId: question.id,
        selectedIndex: index,
        kgValue: answer.kgPerYear,
      },
      question.question,
      answer.text
    );
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
        {question.answers.map((answer, index) => {
          let className = 'quiz-answer';
          if (selectedIndex === index) {
            const quality = getAnswerQuality(answer.kgPerYear);
            className += quality === 'good' ? ' selected-good' : ' selected-bad';
          }
          const isSelected = selectedIndex === index;

          return (
            <button
              key={index}
              ref={index === 0 ? firstOptionRef : null}
              className={className}
              onClick={() => handleSelect(index)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelect(index);
                }
              }}
              disabled={selectedIndex !== null}
              type="button"
              id={`quiz-q${question.id}-a${index}`}
              aria-pressed={isSelected}
              style={{
                animationDelay: `${0.1 + index * 0.1}s`,
                pointerEvents: selectedIndex !== null ? 'none' : 'auto'
              }}
            >
              {answer.text}
            </button>
          );
        })}
      </div>

      {microResponse && (
        <p className="micro-response" style={{
          animation: 'fadeInUp 0.3s ease-out',
          fontStyle: 'italic',
          color: 'var(--text-data)',
          marginTop: '1rem',
          textAlign: 'center',
          fontSize: '0.9rem',
        }}>
          {microResponse}
        </p>
      )}
    </div>
  );
};

export default React.memo(QuizCard);
