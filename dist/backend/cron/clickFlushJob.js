"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clickFlushService_1 = require("../services/clickFlushService");
console.log('⏱️ Click flush cron started (every 5 minutes)');
setInterval(() => {
    (0, clickFlushService_1.flushClickCountsToDB)();
}, 5 * 60 * 1000); // 5 minutes
