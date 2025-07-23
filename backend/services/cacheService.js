const redisClient = require('../utils/cacheClient');

async function getFromCache(key) {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error('Redis GET error:', err);
    return null;
  }
}

async function setToCache(key, value, ttlInSeconds = 600) {
  try {
    await redisClient.set(key, JSON.stringify(value), {
      EX: ttlInSeconds,
    });
  } catch (err) {
    console.error('Redis SET error:', err);
  }
}

async function deleteFromCache(key) {
  try {
    await redisClient.del(key);
  } catch (err) {
    console.error('Redis DEL error:', err);
  }
}

module.exports = {
  getFromCache,
  setToCache,
  deleteFromCache,
};
