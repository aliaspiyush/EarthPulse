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

export const TIER_THRESHOLDS = {
  GUARDIAN: 4000,
  AWARE: 8000,
  AVERAGE: 14000,
} as const;

export const CO2_BASELINES = {
  GLOBAL_AVERAGE: 4700,
  MAX_SCALE: 20000,
  QUESTION_MAX: 4000,
} as const;

/**
 * Determine tier from total kg CO₂ per year.
 * Thresholds based on global per-capita ranges:
 * - Source: Our World in Data, 2022 global average ~4.7 tonnes/person/year
 * - Tiers are designed around that baseline.
 */
export function getTier(totalKg: number): NonNullable<Tier> {
  if (totalKg < TIER_THRESHOLDS.GUARDIAN) return 'EcoGuardian';
  if (totalKg < TIER_THRESHOLDS.AWARE) return 'Aware Citizen';
  if (totalKg < TIER_THRESHOLDS.AVERAGE) return 'Average Impact';
  return 'Heavy Footprint';
}
