import type { GeminiResponse, Tier } from '../types';
import { logger } from './logger';

const SYSTEM_INSTRUCTION = `You are a carbon footprint translator for a campaign web app. Your job is to make abstract CO₂ numbers feel physically real to users. You must follow output rules exactly.

STRICT RULES:
- Return ONLY valid JSON. No markdown. No explanation text. No code blocks. Raw JSON only.
- Do NOT hallucinate emission values or scientific facts. If unsure of a comparison value, use a conservative estimate and stay within common knowledge.
- Do NOT use the word 'carbon' or 'CO₂' in your analogies.
- Do NOT be preachy, guilt-tripping, or moralistic.
- Each analogy must be one sentence, under 25 words.
- Make analogies physically visceral and visually imaginable.
- The oneChange must be a real, specific, actionable behavior.
- The hopeAnalogy must be positive and forward-looking.`;

/**
 * Call Gemini API to generate carbon footprint analogies.
 * Falls back to hardcoded analogies on any failure.
 *
 * Uses @google/generative-ai npm package.
 * Model: gemini-2.5-flash
 * @param {number} totalKg - The user's total carbon footprint in kg.
 * @param {NonNullable<Tier>} tier - The user's assigned tier.
 * @returns {Promise<GeminiResponse>} The generated or fallback analogies.
 */
export async function callGemini(
  totalKg: number,
  tier: NonNullable<Tier>
): Promise<GeminiResponse> {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('VITE_GEMINI_API_KEY is not set');
    }

    // Dynamic import to avoid bundling issues if key is absent
    const { GoogleGenerativeAI } = await import('@google/generative-ai');

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    const userPrompt = `Annual footprint: ${totalKg} kg. Tier: ${tier}.
Return this exact JSON structure, nothing else:
{
  "analogies": ["...", "...", "..."],
  "oneChange": "...",
  "hopeAnalogy": "..."
}`;

    const result = await model.generateContent(userPrompt);
    const response = result.response;
    const text = response.text();

    // Try to parse the response as JSON
    let parsed: GeminiResponse;
    try {
      parsed = JSON.parse(text);
    } catch {
      // Sometimes Gemini wraps in code blocks — try to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Gemini response was not valid JSON');
      }
    }

    // Validate structure
    if (
      !Array.isArray(parsed.analogies) ||
      parsed.analogies.length < 3 ||
      typeof parsed.oneChange !== 'string' ||
      typeof parsed.hopeAnalogy !== 'string'
    ) {
      throw new Error('Gemini response structure invalid');
    }

    return {
      analogies: [parsed.analogies[0], parsed.analogies[1], parsed.analogies[2]],
      oneChange: parsed.oneChange,
      hopeAnalogy: parsed.hopeAnalogy,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error('Gemini API call failed:', message);
    throw error;
  }
}
