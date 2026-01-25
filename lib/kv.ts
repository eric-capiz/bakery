import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL || '',
  token: process.env.KV_REST_API_TOKEN || '',
});

export async function getData(key: string): Promise<string | null> {
  try {
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      console.error('Redis credentials not configured', {
        hasUrl: !!process.env.KV_REST_API_URL,
        hasToken: !!process.env.KV_REST_API_TOKEN,
        urlLength: process.env.KV_REST_API_URL?.length || 0,
        tokenLength: process.env.KV_REST_API_TOKEN?.length || 0,
      });
      return null;
    }
    const value = await redis.get(key);
    
    // Upstash Redis returns the value directly (could be string, object, etc.)
    // If it's already a string, return it
    if (typeof value === 'string') {
      return value;
    }
    // If it's null or undefined, return null
    if (value === null || value === undefined) {
      return null;
    }
    // If it's an object/array, stringify it (Redis might have auto-parsed JSON)
    return JSON.stringify(value);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error(`Error getting ${key}:`, errorMessage, errorStack);
    return null;
  }
}

export async function setData(key: string, value: string): Promise<void> {
  try {
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      const errorMsg = 'Redis credentials not configured';
      console.error(errorMsg, {
        hasUrl: !!process.env.KV_REST_API_URL,
        hasToken: !!process.env.KV_REST_API_TOKEN,
      });
      throw new Error(errorMsg);
    }
    await redis.set(key, value);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error(`Error setting ${key}:`, errorMessage, errorStack);
    throw error;
  }
}

export { redis };

