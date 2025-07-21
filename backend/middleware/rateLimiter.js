const rateLimit = require('express-rate-limit');
const config = require('../config/config');

const limiter = rateLimit(config.RATE_LIMIT_OPTIONS);

module.exports = limiter;