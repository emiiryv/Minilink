"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const linkController_1 = require("../controllers/linkController");
const router = express_1.default.Router();
// Public redirect route for short links
router.get('/:shortCode', linkController_1.redirectToOriginalUrl);
exports.default = router;
