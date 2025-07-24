import rateLimit from 'express-rate-limit';
import config from '../config/config';

const limiter = rateLimit(config.RATE_LIMIT_OPTIONS);

export default limiter;