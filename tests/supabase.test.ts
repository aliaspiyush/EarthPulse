import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { savePledge, getTotalPledged } from '../src/utils/supabase';
import { logger } from '../src/utils/logger';

vi.mock('../src/utils/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

describe('supabase utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
    vi.stubEnv('VITE_SUPABASE_URL', 'https://mock.supabase.co');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'mock-key');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('savePledge', () => {
    it('should silently abort if env vars are missing', async () => {
      vi.unstubAllEnvs();
      await savePledge([1, 2], 500);
      expect(global.fetch).not.toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalledWith('Supabase not configured — pledge saved locally only.');
    });

    it('should call fetch with correct data', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
      });

      await savePledge([1, 2], 500);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://mock.supabase.co/rest/v1/pledges',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('"total_kg_saved":500'),
        })
      );
    });

    it('should log warning if response is not ok', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: false,
        status: 500,
      });

      await savePledge([1, 2], 500);
      expect(logger.warn).toHaveBeenCalledWith('Supabase pledge save failed:', 500);
    });
  });

  describe('getTotalPledged', () => {
    it('should return null if env vars are missing', async () => {
      vi.unstubAllEnvs();
      const result = await getTotalPledged();
      expect(result).toBeNull();
    });

    it('should return number on success', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => 1500,
      });

      const result = await getTotalPledged();
      expect(result).toBe(1500);
    });

    it('should handle complex json responses', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => [{ total: 2500 }],
      });

      const result = await getTotalPledged();
      expect(result).toBe(2500);
    });

    it('should return null on fetch failure', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'));

      const result = await getTotalPledged();
      expect(result).toBeNull();
      expect(logger.warn).toHaveBeenCalledWith('Supabase total fetch error:', 'Network error');
    });
  });
});
