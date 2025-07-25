"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFromCache = getFromCache;
exports.setToCache = setToCache;
exports.deleteFromCache = deleteFromCache;
const cacheClient_1 = __importDefault(require("../utils/cacheClient"));
const legacyRedis = cacheClient_1.default;
async function getFromCache(key) {
    try {
        const data = await legacyRedis.get(key);
        return data ? JSON.parse(data) : null;
    }
    catch (err) {
        console.error('Redis GET error:', err);
        return null;
    }
}
async function setToCache(key, value, ttlInSeconds = 600) {
    try {
        await legacyRedis.set(key, JSON.stringify(value), {
            EX: ttlInSeconds
        });
    }
    catch (err) {
        console.error('Redis SET error:', err);
    }
}
async function deleteFromCache(key) {
    try {
        await legacyRedis.del(key);
    }
    catch (err) {
        console.error('Redis DEL error:', err);
    }
}
