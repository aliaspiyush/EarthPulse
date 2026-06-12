import { useState, useCallback, useMemo } from 'react';
import type { QuizAnswer, UserFootprint } from '../types';
import { questions } from '../data/questions';
import { calculateFootprint } from '../utils/emissions';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ANIMATION_DURATIONS } from '../utils/constants';

export function useQuiz(onComplete: (footprint: UserFootprint) => void) {
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [microResponse, setMicroResponse] = useState<string | null>(null);

  const runningScore = useMemo(() => {
    return answers.reduce((acc, a) => acc + a.kgValue, 0);
  }, [answers]);

  const handleAnswer = useCallback(
    async (answer: QuizAnswer, questionText: string, answerText: string) => {
      const newAnswers = [...answers, answer];
      setAnswers(newAnswers);

      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      let micro = null;

      if (apiKey) {
        try {
          const genAI = new GoogleGenerativeAI(apiKey);
          const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
          const prompt = `The user just answered '${questionText}' with '${answerText}' (contributing ${answer.kgValue} kg CO₂/year to their footprint). Write ONE short sentence, under 12 words, that is observational and non-judgmental. No advice. Just an honest reflection. Return plain text only, no JSON.`;

          // Timeout after 500ms
          const fetchPromise = model.generateContent(prompt);
          const timeoutPromise = new Promise<null>((resolve) =>
            setTimeout(() => resolve(null), ANIMATION_DURATIONS.GEMINI_TIMEOUT)
          );

          const result = await Promise.race([fetchPromise, timeoutPromise]);
          if (result && 'response' in result) {
            micro = result.response.text().trim();
          }
        } catch {
          // Ignore error, fallback to immediate advance
        }
      }

      const advance = () => {
        setMicroResponse(null);
        if (newAnswers.length >= questions.length) {
          const footprint = calculateFootprint(newAnswers);
          setTimeout(() => onComplete(footprint), ANIMATION_DURATIONS.QUIZ_COMPLETE);
        } else {
          setTimeout(() => setCurrentQuestionIdx((prev) => prev + 1), ANIMATION_DURATIONS.QUIZ_ADVANCE);
        }
      };

      if (micro) {
        setMicroResponse(micro);
        setTimeout(advance, ANIMATION_DURATIONS.MICRO_RESPONSE_SHOW);
      } else {
        advance();
      }
    },
    [answers, onComplete]
  );

  const isComplete = answers.length >= questions.length;

  return {
    answers,
    currentQuestionIdx,
    runningScore,
    handleAnswer,
    isComplete,
    microResponse,
  };
}
