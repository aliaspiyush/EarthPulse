import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateShareImage } from '../src/utils/shareCard';
import { logger } from '../src/utils/logger';

// Mock html2canvas
vi.mock('html2canvas', () => ({
  default: vi.fn().mockResolvedValue({
    toBlob: vi.fn((cb) => cb(new Blob(['mock-image']))),
    toDataURL: vi.fn(() => 'data:image/png;base64,mock'),
  }),
}));

vi.mock('../src/utils/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

describe('shareCard', () => {
  const originalAlert = window.alert;

  beforeEach(() => {
    vi.clearAllMocks();
    window.alert = vi.fn();
    // Setup generic navigator.share support mock
    Object.assign(navigator, {
      share: vi.fn().mockResolvedValue(undefined),
      canShare: vi.fn().mockReturnValue(true),
    });
  });

  afterEach(() => {
    window.alert = originalAlert;
  });

  it('should attempt to share via Web Share API if supported', async () => {
    const el = document.createElement('div');
    await generateShareImage(el);

    expect(navigator.share).toHaveBeenCalled();
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('should fallback to download if Web Share API is unsupported', async () => {
    Object.assign(navigator, {
      canShare: vi.fn().mockReturnValue(false),
    });

    const el = document.createElement('div');
    const spyAppend = vi.spyOn(document.body, 'appendChild');
    const spyRemove = vi.spyOn(document.body, 'removeChild');

    await generateShareImage(el);

    expect(navigator.share).not.toHaveBeenCalled();
    expect(spyAppend).toHaveBeenCalled();
    expect(spyRemove).toHaveBeenCalled();
  });

  it('should handle share API failure gracefully', async () => {
    Object.assign(navigator, {
      share: vi.fn().mockRejectedValue(new Error('Share failed')),
    });

    const el = document.createElement('div');
    await generateShareImage(el);

    expect(logger.info).toHaveBeenCalledWith('Web Share API failed, falling back to download.');
  });
});
