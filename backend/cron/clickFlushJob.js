


const { flushClickCountsToDB } = require('../services/clickFlushService');

console.log('⏱️ Click flush cron started (every 5 minutes)');

setInterval(() => {
  flushClickCountsToDB();
}, 5 * 60 * 1000); // 5 minutes