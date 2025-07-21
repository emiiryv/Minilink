require('dotenv').config();

const config = {
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET || 'default-secret',
  BASE_URL: process.env.BASE_URL || 'http://localhost:3001',
  RATE_LIMIT_OPTIONS: {
    windowMs: 15 * 60 * 1000, // 15 dakika
    max: 100, // her IP için 15 dakikada 100 istek
    message: 'Çok fazla istek gönderildi, lütfen daha sonra tekrar deneyin.'
  }
};

module.exports = config;