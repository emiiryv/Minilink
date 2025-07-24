"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
// Kayıt
router.post('/register', authController_1.register);
// Giriş
router.post('/login', authController_1.login);
// 404 - Bulunamadı
router.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});
exports.default = router;
