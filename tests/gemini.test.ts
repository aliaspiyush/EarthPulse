import { describe, it, expect, vi, beforeEach } from 'vitest';
import { callGemini } from '../src/utils/gemini';

// Mock the Generative AI library
const mockGenerateContent = vi.fn();
vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: class {
    getGenerativeModel() {
      return { generateContent: mockGenerateContent };
    }
  }
}));

describe('callGemini', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('VITE_GEMINI_API_KEY', 'mock-key');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('should throw error if API key is missing', async () => {
    vi.unstubAllEnvs();
    
    await expect(callGemini(1000, 'EcoGuardian')).rejects.toThrow('VITE_GEMINI_API_KEY is not set');
  });

  it('should return parsed response on success', async () => {
    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => JSON.stringify({
          analogies: ['A1', 'A2', 'A3'],
          oneChange: 'C1',
          hopeAnalogy: 'H1',
        }),
      },
    });

    const result = await callGemini(1000, 'EcoGuardian');
    expect(result).toEqual({
      analogies: ['A1', 'A2', 'A3'],
      oneChange: 'C1',
      hopeAnalogy: 'H1',
    });
  });

  it('should throw if response is not valid JSON', async () => {
    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => 'Invalid text response',
      },
    });

    await expect(callGemini(1000, 'EcoGuardian')).rejects.toThrow('Gemini response was not valid JSON');
  });

  it('should throw if response structure is invalid', async () => {
    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => JSON.stringify({ analogies: ['A1'] }), // Missing fields
      },
    });

    await expect(callGemini(1000, 'EcoGuardian')).rejects.toThrow('Gemini response structure invalid');
  });

  it('should extract JSON from markdown code blocks', async () => {
    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => '```json\n{\n  "analogies": ["B1", "B2", "B3"],\n  "oneChange": "C2",\n  "hopeAnalogy": "H2"\n}\n```',
      },
    });

    const result = await callGemini(1000, 'EcoGuardian');
    expect(result.oneChange).toBe('C2');
  });
});
