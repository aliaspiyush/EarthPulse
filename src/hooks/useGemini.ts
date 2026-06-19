import { useState, useCallback } from 'react';
import type { GeminiResponse, Tier } from '../types';
import { callGemini } from '../utils/gemini';
import { FALLBACK_ANALOGIES } from '../data/fallbacks';

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
    } catch {
      setGeminiError(true);
      setGeminiResponse(FALLBACK_ANALOGIES[tier]);
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
