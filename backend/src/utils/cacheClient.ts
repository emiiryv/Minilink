import { createClient, RedisClientType } from 'redis';

const baseClient = createClient({ url: 'redis://localhost:6379' });
// @ts-expect-error: legacyMode is not in the type but is used intentionally for backwards compatibility
const client = baseClient.duplicate({ legacyMode: true });

client.on('error', (err) => {
  console.error('Redis connection error:', err);
});

client.connect()
  .then(() => {
    console.log('✅ Redis connected');
  })
  .catch((err) => {
    console.error('❌ Redis connection failed:', err);
  });

export default client;