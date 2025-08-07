"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const linkController_1 = require("../controllers/linkController");
const rateLimiter_1 = __importDefault(require("../middleware/rateLimiter"));
const router = express_1.default.Router();
// Public redirect route for short links
router.get('/:shortCode', rateLimiter_1.default, linkController_1.redirectToOriginalUrl);
exports.default = router;
