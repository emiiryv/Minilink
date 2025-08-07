"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const auth_1 = __importDefault(require("../middleware/auth"));
const isAdmin_1 = __importDefault(require("../middleware/isAdmin"));
const router = express_1.default.Router();
// Auth + Admin kontrolü
router.use(auth_1.default, isAdmin_1.default);
router.get('/users', adminController_1.getAllUsers);
router.get('/links', adminController_1.getAllLinks);
router.get('/users/:id/links', adminController_1.getUserLinks);
router.delete('/users/:id', adminController_1.deleteUser);
router.delete('/links/:id', adminController_1.deleteLink);
router.patch('/links/:id', adminController_1.updateLink);
const adminController_2 = require("../controllers/adminController");
router.get('/stats', adminController_2.getDashboardStats);
exports.default = router;
