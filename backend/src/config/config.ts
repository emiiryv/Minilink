import dotenv from 'dotenv';
dotenv.config();

const config = {
  DATABASE_URL: process.env.DATABASE_URL as string,
  JWT_SECRET: process.env.JWT_SECRET || 'default-secret',
  BASE_URL: process.env.BASE_URL || 'http://localhost:3001',
  RATE_LIMIT_OPTIONS: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000,
    message: 'Çok fazla istek gönderildi, lütfen daha sonra tekrar deneyin.'
  }
};

export default config;