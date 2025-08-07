"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_rate_limit_1 = __importStar(require("express-rate-limit"));
const rate_limit_redis_1 = __importDefault(require("rate-limit-redis"));
const config_1 = __importDefault(require("../config/config"));
const cacheClient_1 = __importDefault(require("../utils/cacheClient"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Rate limiter applied to redirects (e.g., GET /:short_code) instead of link creation
const redirectLimiter = (0, express_rate_limit_1.default)({
    windowMs: config_1.default.RATE_LIMIT_OPTIONS.windowMs,
    max: config_1.default.RATE_LIMIT_OPTIONS.max,
    standardHeaders: true,
    legacyHeaders: false,
    store: new rate_limit_redis_1.default({
        sendCommand: (...args) => cacheClient_1.default.sendCommand(args),
    }),
    keyGenerator: (req) => {
        const ip = (0, express_rate_limit_1.ipKeyGenerator)(req);
        const authHeader = req.headers['authorization'];
        let tokenId = 'no-token';
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            try {
                const decoded = jsonwebtoken_1.default.decode(token);
                tokenId = decoded?.id || 'invalid-token';
            }
            catch {
                tokenId = 'invalid-token';
            }
        }
        return `${ip}-${tokenId}`;
    },
});
exports.default = redirectLimiter;
