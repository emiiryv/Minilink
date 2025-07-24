"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nanoid_1 = require("nanoid");
function generateShortCode() {
    return (0, nanoid_1.nanoid)(6);
}
exports.default = generateShortCode;
