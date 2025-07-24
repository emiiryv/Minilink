import redisClient from '../utils/cacheClient';

export async function getFromCache<T>(key: string): Promise<T | null> {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) as T : null;
  } catch (err) {
    console.error('Redis GET error:', err);
    return null;
  }
}

export async function setToCache(key: string, value: any, ttlInSeconds = 600): Promise<void> {
  try {
    await redisClient.set(key, JSON.stringify(value), {
      EX: ttlInSeconds,
    });
  } catch (err) {
    console.error('Redis SET error:', err);
  }
}

export async function deleteFromCache(key: string): Promise<void> {
  try {
    await redisClient.del(key);
  } catch (err) {
    console.error('Redis DEL error:', err);
  }
}
