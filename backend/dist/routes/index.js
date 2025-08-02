"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const linkRoutes_1 = __importDefault(require("./linkRoutes"));
const authRoutes_1 = __importDefault(require("./authRoutes"));
const adminRoutes_1 = __importDefault(require("./adminRoutes"));
const router = express_1.default.Router();
router.use('/links', linkRoutes_1.default);
router.use('/auth', authRoutes_1.default);
router.use('/admin', adminRoutes_1.default);
exports.default = router;
