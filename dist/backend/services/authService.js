"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'gizli-anahtar';
async function registerUser(username, password) {
    const existingUser = await prisma.user.findUnique({
        where: { username },
    });
    if (existingUser) {
        throw { status: 400, message: 'Kullanıcı adı zaten kullanılıyor.' };
    }
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            username,
            password: hashedPassword,
        },
    });
    return user;
}
async function loginUser(username, password) {
    const user = await prisma.user.findUnique({
        where: { username },
    });
    if (!user) {
        throw { status: 401, message: 'Geçersiz kullanıcı adı veya şifre.' };
    }
    const match = await bcrypt_1.default.compare(password, user.password);
    if (!match) {
        throw { status: 401, message: 'Geçersiz kullanıcı adı veya şifre.' };
    }
    const token = jsonwebtoken_1.default.sign({ id: user.id, username: user.username, is_admin: user.is_admin }, JWT_SECRET, { expiresIn: '7d' });
    return { token };
}
