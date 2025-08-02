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
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'gizli-anahtar';
const passwordSchema = zod_1.z
    .string()
    .min(8, 'Şifre en az 8 karakter olmalıdır.')
    .regex(/[A-Z]/, 'Şifre en az bir büyük harf içermelidir.')
    .regex(/[a-z]/, 'Şifre en az bir küçük harf içermelidir.')
    .regex(/[0-9]/, 'Şifre en az bir rakam içermelidir.')
    .regex(/[^A-Za-z0-9]/, 'Şifre en az bir özel karakter içermelidir.');
async function registerUser(username, password) {
    const existingUser = await prisma.user.findUnique({
        where: { username },
    });
    if (existingUser) {
        throw { status: 400, message: 'Kullanıcı adı zaten kullanılıyor.' };
    }
    try {
        passwordSchema.parse(password);
    }
    catch (err) {
        const issues = err.issues.map((i) => i.message).join(', ');
        throw { status: 400, message: `Şifre geçersiz: ${issues}` };
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
    return { token, user }; // ✅ user bilgisi de dönüyor
}
