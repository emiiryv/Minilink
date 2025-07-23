require('dotenv').config();
const redisClient = require('../utils/cacheClient');
const prisma = require('../prismaClient');

async function flushClickCountsToDB() {
  try {
    const keys = await redisClient.keys('click:*');

    for (const key of keys) {
      const shortCode = key.replace('click:', '');
      const count = parseInt(await redisClient.get(key));

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

module.exports = { flushClickCountsToDB };