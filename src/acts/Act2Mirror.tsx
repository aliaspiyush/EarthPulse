import React, { useState, useMemo, useCallback } from 'react';
import type { QuizAnswer, UserFootprint } from '../types';
import { questions } from '../data/questions';
import { calculateFootprint } from '../utils/emissions';
import QuizCard from '../components/QuizCard';

interface Act2Props {
  onComplete: (footprint: UserFootprint) => void;
}

/**
 * Act 2: THE MIRROR — Lifestyle Quiz
 * 7 questions, one at a time, with reactive background gradient.
 */
const Act2Mirror: React.FC<Act2Props> = ({ onComplete }) => {
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);

  const runningScore = useMemo(() => {
    return answers.reduce((acc, a) => acc + a.kgValue, 0);
  }, [answers]);

  // Background interpolates: good → forest green, bad → smog purple
  const backgroundStyle = useMemo((): React.CSSProperties => {
    if (answers.length === 0) {
      return { background: 'linear-gradient(180deg, #060A06 0%, #0C1A0E 30%, #1B4332 70%, #2D6A4F 100%)' };
    }
    const avgPerQuestion = runningScore / answers.length;
    const badness = Math.min(avgPerQuestion / 4000, 1);
    
    // Good: #060A06 -> #0C1A0E -> #1B4332 -> #2D6A4F
    // Bad:  #0A0806 -> #1A0E08 -> #2C1A0F -> #2C1A0F
    
    // We'll just interpolate the bottom color for simplicity: #2D6A4F (good) to #2C1A0F (bad)
    const r = Math.round(45 + (44 - 45) * badness);
    const g = Math.round(106 + (26 - 106) * badness);
    const b = Math.round(79 + (15 - 79) * badness);
    
    return {
      background: `linear-gradient(180deg, #060A06 0%, #0C1A0E 30%, rgb(${r}, ${g}, ${b}) 100%)`,
      transition: 'background 0.6s ease',
    };
  }, [answers.length, runningScore]);

  const progressBarStyle = useMemo((): React.CSSProperties => {
    if (answers.length === 0) return { width: '0%' };
    const width = `${(answers.length / questions.length) * 100}%`;
    const avgPerQ = runningScore / answers.length;
    const goodness = 1 - Math.min(avgPerQ / 4000, 1);
    const r = Math.round(255 + (82 - 255) * goodness);
    const g = Math.round(82 + (196 - 82) * goodness);
    const b = Math.round(82 + (26 - 82) * goodness);
    return { width, backgroundColor: `rgb(${r}, ${g}, ${b})` };
  }, [answers.length, runningScore]);

  const handleAnswer = useCallback(
    (answer: QuizAnswer) => {
      const newAnswers = [...answers, answer];
      setAnswers(newAnswers);

      if (newAnswers.length >= questions.length) {
        const footprint = calculateFootprint(newAnswers);
        setTimeout(() => onComplete(footprint), 400);
      } else {
        setTimeout(() => setCurrentQuestionIdx((prev) => prev + 1), 300);
      }
    },
    [answers, onComplete]
  );

  const isComplete = answers.length >= questions.length;

  return (
    <section
      className="act act-2"
      id="act-2"
      style={backgroundStyle}
      aria-label="The Mirror - Lifestyle Quiz"
    >
      <div
        className="quiz-progress-bar"
        style={progressBarStyle}
        role="progressbar"
        aria-valuenow={answers.length}
        aria-valuemin={0}
        aria-valuemax={questions.length}
      />

      <div className="quiz-wrapper">
        {!isComplete && currentQuestionIdx < questions.length && (
          <QuizCard
            key={questions[currentQuestionIdx].id}
            question={questions[currentQuestionIdx]}
            questionIndex={currentQuestionIdx}
            totalQuestions={questions.length}
            onAnswer={handleAnswer}
          />
        )}

        {isComplete && (
          <div style={{ textAlign: 'center', animation: 'fadeInUp 0.6s ease-out' }}>
            <p style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 28,
              fontWeight: 700,
              color: 'white',
              marginBottom: 8,
            }}>
              Calculating your impact...
            </p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
              Scroll down to see your results ↓
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Act2Mirror;
