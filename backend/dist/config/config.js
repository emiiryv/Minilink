"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET || 'default-secret',
    BASE_URL: process.env.BASE_URL || 'http://localhost:3001',
    RATE_LIMIT_OPTIONS: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 10,
        message: 'Çok fazla istek gönderildi, lütfen daha sonra tekrar deneyin.'
    }
};
exports.default = config;
