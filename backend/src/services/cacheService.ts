import type { RedisClientType } from 'redis';
import redisClient from '../utils/cacheClient';

const legacyRedis = redisClient as unknown as RedisClientType;

export async function getFromCache<T>(key: string): Promise<T | null> {
  try {
    const data = await legacyRedis.get(key);
    return data ? JSON.parse(data) as T : null;
  } catch (err) {
    console.error('Redis GET error:', err);
    return null;
  }
}

export async function setToCache(key: string, value: any, ttlInSeconds = 600): Promise<void> {
  try {
    await legacyRedis.set(key, JSON.stringify(value), {
      EX: ttlInSeconds
    });
  } catch (err) {
    console.error('Redis SET error:', err);
  }
}

export async function deleteFromCache(key: string): Promise<void> {
  try {
    await legacyRedis.del(key);
  } catch (err) {
    console.error('Redis DEL error:', err);
  }
}
