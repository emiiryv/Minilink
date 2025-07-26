import app from './app';
import { env } from './config/env';
import prisma from './prismaClient';
import redisClient from './utils/cacheClient';


const PORT = Number(env.PORT);

async function assertDbConnectionOk() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connection OK');
  } catch (err) {
    console.error('❌ Unable to connect to the database:', err);
    process.exit(1);
  }
}

async function connectRedis() {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
      console.log('✅ Redis connected');
    } else {
      console.log('ℹ️ Redis already connected');
    }
  } catch (err) {
    console.error('❌ Redis connection failed:', err);
    process.exit(1);
  }
}

(async () => {
  await assertDbConnectionOk();
  await connectRedis();

  app.listen(PORT, () => {
    console.log(`🚀 Minilink backend is running on http://localhost:${PORT}`);
  });
})();