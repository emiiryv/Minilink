"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const linkController_1 = require("../controllers/linkController");
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
// Yeni kısa link oluşturma
router.post('/', auth_1.default, linkController_1.shortenUrl);
// Kullanıcının linklerini getir (korumalı)
router.get('/me', auth_1.default, linkController_1.getMyLinks);
// Link silme (korumalı)
router.delete('/:id', auth_1.default, linkController_1.deleteLink);
// Kullanıcının kendi linki için QR kod üretme
router.get('/:id/qrcode', auth_1.default, linkController_1.generateUserQrCode);
exports.default = router;
