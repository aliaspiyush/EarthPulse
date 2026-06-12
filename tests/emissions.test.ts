import { describe, it, expect } from 'vitest';
import { calculateFootprint, getTier } from '../src/utils/emissions';
import { QuizAnswer } from '../src/types';

describe('Emissions Utilities', () => {
  describe('getTier', () => {
    it('returns EcoGuardian for < 4000 kg', () => {
      expect(getTier(3999)).toBe('EcoGuardian');
      expect(getTier(0)).toBe('EcoGuardian');
    });

    it('returns Aware Citizen for 4000 to 7999 kg', () => {
      expect(getTier(4000)).toBe('Aware Citizen');
      expect(getTier(7999)).toBe('Aware Citizen');
    });

    it('returns Average Impact for 8000 to 13999 kg', () => {
      expect(getTier(8000)).toBe('Average Impact');
      expect(getTier(13999)).toBe('Average Impact');
    });

    it('returns Heavy Footprint for >= 14000 kg', () => {
      expect(getTier(14000)).toBe('Heavy Footprint');
      expect(getTier(20000)).toBe('Heavy Footprint');
    });
  });

  describe('calculateFootprint', () => {
    it('calculates the total correctly and assigns the right tier', () => {
      const answers: QuizAnswer[] = [
        { questionId: 1, selectedIndex: 0, kgValue: 2000 },
        { questionId: 2, selectedIndex: 0, kgValue: 3000 },
      ];
      
      const result = calculateFootprint(answers);
      
      expect(result.totalKg).toBe(5000);
      expect(result.tier).toBe('Aware Citizen');
      expect(result.breakdown).toEqual(answers);
    });

    it('floors the total at 0 if negative values exceed positive ones', () => {
      const answers: QuizAnswer[] = [
        { questionId: 1, selectedIndex: 0, kgValue: 500 },
        { questionId: 2, selectedIndex: 0, kgValue: -1000 },
      ];
      
      const result = calculateFootprint(answers);
      
      expect(result.totalKg).toBe(0);
      expect(result.tier).toBe('EcoGuardian');
    });

    it('floors fractional totals correctly', () => {
      const answers: QuizAnswer[] = [
        { questionId: 1, selectedIndex: 0, kgValue: 1500.75 },
      ];
      
      const result = calculateFootprint(answers);
      
      expect(result.totalKg).toBe(1500);
    });
  });
});
