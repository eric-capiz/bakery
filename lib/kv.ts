import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL || '',
  token: process.env.KV_REST_API_TOKEN || '',
});

export async function getData(key: string): Promise<string | null> {
  try {
    const value = await redis.get(key);
    return value as string | null;
  } catch (error) {
    console.error(`Error getting ${key}:`, error);
    return null;
  }
}

export async function setData(key: string, value: string): Promise<void> {
  try {
    await redis.set(key, value);
  } catch (error) {
    console.error(`Error setting ${key}:`, error);
    throw error;
  }
}

export { redis };

