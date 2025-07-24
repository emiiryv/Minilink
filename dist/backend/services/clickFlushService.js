"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.flushClickCountsToDB = flushClickCountsToDB;
require("dotenv/config");
const cacheClient_1 = __importDefault(require("../utils/cacheClient"));
const prismaClient_1 = __importDefault(require("../prismaClient"));
async function flushClickCountsToDB() {
    try {
        const keys = await cacheClient_1.default.keys('click:*');
        for (const key of keys) {
            const shortCode = key.replace('click:', '');
            const value = await cacheClient_1.default.get(key);
            const count = parseInt(value || '0');
            if (!isNaN(count) && count > 0) {
                await prismaClient_1.default.link.update({
                    where: { short_code: shortCode },
                    data: {
                        click_count: {
                            increment: count,
                        },
                    },
                });
                await cacheClient_1.default.del(key);
            }
        }
        console.log(`✅ Flushed ${keys.length} click counts to DB.`);
    }
    catch (err) {
        console.error('❌ Failed to flush click counts:', err);
    }
}
