import { QuizAnswer, Tier, UserFootprint } from '../types';

/**
 * Calculate total carbon footprint from quiz answers.
 * Floors at 0 — no negative footprints allowed.
 * @param answers Array of QuizAnswer from the 7-question quiz
 * @returns UserFootprint with total, tier, and breakdown
 */
export function calculateFootprint(answers: QuizAnswer[]): UserFootprint {
  const sum = answers.reduce((acc, a) => acc + a.kgValue, 0);
  const totalKg = Math.max(0, Math.floor(sum));
  return {
    totalKg,
    tier: getTier(totalKg),
    breakdown: answers,
  };
}

/**
 * Determine tier from total kg CO₂ per year.
 * Thresholds based on global per-capita ranges:
 * - Source: Our World in Data, 2022 global average ~4.7 tonnes/person/year
 * - Tiers are designed around that baseline.
 */
export function getTier(totalKg: number): NonNullable<Tier> {
  if (totalKg < 4000) return 'EcoGuardian';
  if (totalKg < 8000) return 'Aware Citizen';
  if (totalKg < 14000) return 'Average Impact';
  return 'Heavy Footprint';
}
