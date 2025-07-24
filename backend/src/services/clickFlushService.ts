import 'dotenv/config';
import redisClient from '../utils/cacheClient';
import prisma from '../prismaClient';

export async function flushClickCountsToDB(): Promise<void> {
  try {
    const keys = await redisClient.keys('click:*');

    for (const key of keys) {
      const shortCode = key.replace('click:', '');
      const value = await redisClient.get(key);
      const count = parseInt(value || '0');

      if (!isNaN(count) && count > 0) {
        await prisma.link.update({
          where: { short_code: shortCode },
          data: {
            click_count: {
              increment: count,
            },
          },
        });

        await redisClient.del(key);
      }
    }

    console.log(`✅ Flushed ${keys.length} click counts to DB.`);
  } catch (err) {
    console.error('❌ Failed to flush click counts:', err);
  }
}