"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.findUserByUsername = findUserByUsername;
const prismaClient_1 = __importDefault(require("../prismaClient"));
// Yeni kullanıcı oluşturur
async function createUser(username, hashedPassword) {
    return await prismaClient_1.default.user.create({
        data: {
            username,
            password: hashedPassword
        }
    });
}
// Kullanıcıyı kullanıcı adına göre bulur
async function findUserByUsername(username) {
    return await prismaClient_1.default.user.findUnique({
        where: {
            username
        }
    });
}
