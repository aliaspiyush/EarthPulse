/**
 * Supabase integration for pledge persistence.
 * Uses direct REST API calls to avoid additional SDK dependency.
 *
 * Table: pledges
 * Columns: id (uuid), session_id (text), actions_pledged (text[]),
 *          total_kg_saved (numeric), created_at (timestamptz)
 *
 * RLS: insert from anon, select SUM for anon (aggregate only)
 */

import { STORAGE_KEYS } from './constants';
import { logger } from './logger';

/**
 * Retrieves the current session ID from sessionStorage.
 * Generates a new UUID if none exists.
 * @returns {string} The unique session identifier.
 */
function getSessionId(): string {
  let sessionId = sessionStorage.getItem(STORAGE_KEYS.SESSION);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem(STORAGE_KEYS.SESSION, sessionId);
  }
  return sessionId;
}

/**
 * Save pledge to Supabase. Fire-and-forget — does not block UI.
 * Fails silently if Supabase is not configured.
 * @param {number[]} actionsPledged - Array of action IDs pledged.
 * @param {number} totalKgSaved - Total kilograms of CO2 saved.
 * @returns {Promise<void>} Resolves when the pledge is processed.
 */
export async function savePledge(
  actionsPledged: number[],
  totalKgSaved: number
): Promise<void> {
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    logger.info('Supabase not configured — pledge saved locally only.');
    return;
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/pledges`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        session_id: getSessionId(),
        actions_pledged: actionsPledged.map(String),
        total_kg_saved: totalKgSaved,
      }),
    });

    if (!response.ok) {
      logger.warn('Supabase pledge save failed:', response.status);
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.warn('Supabase pledge save error:', message);
  }
}

/**
 * Get total pledged kg from all users.
 * Returns null if Supabase is not configured or request fails.
 * @returns {Promise<number | null>} Total pledged globally or null if unavailable.
 */
export async function getTotalPledged(): Promise<number | null> {
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return null;
  }

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/rpc/get_total_pledged`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );

    if (!response.ok) {
      logger.warn('Supabase total fetch failed:', response.status);
      return null;
    }

    const data = await response.json();
    // The RPC function returns a single number
    if (typeof data === 'number') return data;
    // If it returns an array or object, try to extract
    if (Array.isArray(data) && data.length > 0) {
      return Number(data[0]?.total ?? data[0]) || null;
    }
    return typeof data === 'object' && data !== null ? Number(data.total ?? 0) : null;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.warn('Supabase total fetch error:', message);
    return null;
  }
}
