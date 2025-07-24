import { createClient, RedisClientType } from 'redis';

const redisClient: RedisClientType = createClient({
  url: 'redis://localhost:6379',
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

redisClient.connect()
  .then(() => console.log('✅ Redis connected'))
  .catch((err) => console.error('Redis connection failed:', err));

export default redisClient;