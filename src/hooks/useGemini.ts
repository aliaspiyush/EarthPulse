import { useState, useCallback } from 'react';
import type { GeminiResponse, Tier } from '../types';
import { callGemini } from '../utils/gemini';

export function useGemini() {
  const [geminiResponse, setGeminiResponse] = useState<GeminiResponse | null>(null);
  const [geminiLoading, setGeminiLoading] = useState(false);
  const [geminiError, setGeminiError] = useState(false);

  const fetchGeminiResponse = useCallback(async (totalKg: number, tier: NonNullable<Tier>) => {
    setGeminiLoading(true);
    setGeminiError(false);
    try {
      const response = await callGemini(totalKg, tier);
      setGeminiResponse(response);
    } catch (err) {
      console.warn('[EarthPulse] Gemini API Error:', err);
      setGeminiError(true);
    } finally {
      setGeminiLoading(false);
    }
  }, []);

  return {
    geminiResponse,
    setGeminiResponse,
    geminiLoading,
    setGeminiLoading,
    geminiError,
    setGeminiError,
    fetchGeminiResponse,
  };
}
