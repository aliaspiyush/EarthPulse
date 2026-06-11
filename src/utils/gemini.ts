import { GeminiResponse, Tier } from '../types';
import { FALLBACK_ANALOGIES } from '../data/fallbacks';

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
 */
export async function callGemini(
  totalKg: number,
  tier: NonNullable<Tier>
): Promise<GeminiResponse> {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('VITE_GEMINI_API_KEY is not set. Using fallback analogies.');
      return FALLBACK_ANALOGIES[tier];
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
        // JSON parse failed completely — use fallback
        console.warn('Gemini response was not valid JSON, using fallback.');
        return FALLBACK_ANALOGIES[tier];
      }
    }

    // Validate structure
    if (
      !Array.isArray(parsed.analogies) ||
      parsed.analogies.length < 3 ||
      typeof parsed.oneChange !== 'string' ||
      typeof parsed.hopeAnalogy !== 'string'
    ) {
      console.warn('Gemini response structure invalid, using fallback.');
      return FALLBACK_ANALOGIES[tier];
    }

    return {
      analogies: [parsed.analogies[0], parsed.analogies[1], parsed.analogies[2]],
      oneChange: parsed.oneChange,
      hopeAnalogy: parsed.hopeAnalogy,
    };
  } catch (error: unknown) {
    // Explicit error handling — never let this surface to UI
    const message = error instanceof Error ? error.message : String(error);
    console.error('Gemini API call failed:', message);
    return FALLBACK_ANALOGIES[tier];
  }
}
