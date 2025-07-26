"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const prismaClient_1 = __importDefault(require("./prismaClient"));
const cacheClient_1 = __importDefault(require("./utils/cacheClient"));
const PORT = Number(env_1.env.PORT);
async function assertDbConnectionOk() {
    try {
        await prismaClient_1.default.$queryRaw `SELECT 1`;
        console.log('✅ Database connection OK');
    }
    catch (err) {
        console.error('❌ Unable to connect to the database:', err);
        process.exit(1);
    }
}
async function connectRedis() {
    try {
        if (!cacheClient_1.default.isOpen) {
            await cacheClient_1.default.connect();
            console.log('✅ Redis connected');
        }
        else {
            console.log('ℹ️ Redis already connected');
        }
    }
    catch (err) {
        console.error('❌ Redis connection failed:', err);
        process.exit(1);
    }
}
(async () => {
    await assertDbConnectionOk();
    await connectRedis();
    app_1.default.listen(PORT, () => {
        console.log(`🚀 Minilink backend is running on http://localhost:${PORT}`);
    });
})();
