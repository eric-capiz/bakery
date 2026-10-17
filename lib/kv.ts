import { Redis } from '@upstash/redis';

/**
 * Per-site namespace for every KV key.
 *
 * Set SITE_ID per deployment so multiple sites can share a single Upstash
 * Redis database without reading or overwriting each other's data.
 * Defaults to this package's name; override with the SITE_ID env var.
 *
 * NOTE: keys written before namespacing (unprefixed) will no longer be read
 * once this is deployed. If you have existing data under old unprefixed keys,
 * migrate it to `<SITE_ID>:<key>` or keep a single site on the legacy keys.
 */
export const SITE_ID = process.env.SITE_ID || 'ellis-outdoor';

/**
 * Build a namespaced KV key: `<SITE_ID>:part1:part2:...`
 * Prefer passing logical (unprefixed) keys to getData/setData, which apply
 * this automatically. Use siteKey directly only when calling `redis` itself.
 */
export function siteKey(...parts: string[]): string {
  return [SITE_ID, ...parts].join(':');
}

const redis = new Redis({
  url: process.env.KV_REST_API_URL || '',
  token: process.env.KV_REST_API_TOKEN || '',
});

export async function getData(key: string): Promise<string | null> {
  try {
    const nsKey = siteKey(key);
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      console.error('Redis credentials not configured', {
        hasUrl: !!process.env.KV_REST_API_URL,
        hasToken: !!process.env.KV_REST_API_TOKEN,
        urlLength: process.env.KV_REST_API_URL?.length || 0,
        tokenLength: process.env.KV_REST_API_TOKEN?.length || 0,
      });
      return null;
    }
    const value = await redis.get(nsKey);
    
    // Upstash Redis returns the value directly (could be string, object, etc.)
    // If it is already a string, return it
    if (typeof value === 'string') {
      return value;
    }
    // If it is null or undefined, return null
    if (value === null || value === undefined) {
      return null;
    }
    // If it is an object or array, stringify it (Redis might have auto parsed JSON)
    return JSON.stringify(value);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error(`Error getting ${siteKey(key)}:`, errorMessage, errorStack);
    return null;
  }
}

export async function setData(key: string, value: string): Promise<void> {
  try {
    const nsKey = siteKey(key);
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      const errorMsg = 'Redis credentials not configured';
      console.error(errorMsg, {
        hasUrl: !!process.env.KV_REST_API_URL,
        hasToken: !!process.env.KV_REST_API_TOKEN,
      });
      throw new Error(errorMsg);
    }
    await redis.set(nsKey, value);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error(`Error setting ${siteKey(key)}:`, errorMessage, errorStack);
    throw error;
  }
}

export { redis };

