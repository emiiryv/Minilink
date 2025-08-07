import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import config from '../config/config';
import redisClient from '../utils/cacheClient';
import { Request } from 'express';
import jwt from 'jsonwebtoken';

// Rate limiter applied to redirects (e.g., GET /:short_code) instead of link creation
const redirectLimiter = rateLimit({
  windowMs: config.RATE_LIMIT_OPTIONS.windowMs,
  max: config.RATE_LIMIT_OPTIONS.max,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.sendCommand(args),
  }),
  keyGenerator: (req: Request): string => {
    const ip = ipKeyGenerator(req as any);
    const authHeader = req.headers['authorization'];
    let tokenId = 'no-token';

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded: any = jwt.decode(token);
        tokenId = decoded?.id || 'invalid-token';
      } catch {
        tokenId = 'invalid-token';
      }
    }

    return `${ip}-${tokenId}`;
  },
});

export default redirectLimiter;