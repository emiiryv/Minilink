import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(10),
  BASE_URL: z.string().url(),
  CORS_ORIGIN: z.string().url(),
  PORT: z
    .string()
    .refine((val) => /^\d+$/.test(val), { message: 'PORT must be a number' })
    .default('3001'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:', parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;
