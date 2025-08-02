import 'dotenv/config';
import redisClient from '../utils/cacheClient';
import prisma from '../prismaClient';

export async function flushClickCountsToDB(): Promise<void> {
  try {
    const keys = await redisClient.keys('click:*');
    let flushedCount = 0;

    for (const key of keys) {
      const shortCode = key.replace('click:', '');
      const value = await redisClient.get(key);
      const count = parseInt(value || '0');

      if (!isNaN(count) && count > 0) {
        try {
          await prisma.link.update({
            where: { short_code: shortCode },
            data: {
              click_count: {
                increment: count,
              },
            },
          });
          flushedCount++;
        } catch (err: any) {
          if (err.code === 'P2025') {
            // Kısa kod DB'de yoksa Redis'ten sil
            await redisClient.del(key);
            console.warn(`⚠️ No link found for short code "${shortCode}". Redis key deleted.`);
          } else {
            throw err;
          }
        }

        await redisClient.del(key);
      }
    }

    console.log(`✅ Flushed ${flushedCount} click counts to DB.`);
  } catch (err) {
    console.error('❌ Failed to flush click counts:', err);
  }
}