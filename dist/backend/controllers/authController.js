"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
const authService_1 = require("../services/authService");
// Yeni kullanıcı kaydı işlemini yöneten controller fonksiyonu
async function register(req, res, next) {
    const { username, password } = req.body;
    try {
        const user = await (0, authService_1.registerUser)(username, password);
        res.status(201).json({ message: 'Kayıt başarılı', user: { id: user.id, username: user.username } });
    }
    catch (err) {
        next(err);
    }
}
// Kullanıcı girişi işlemini yöneten controller fonksiyonu
async function login(req, res, next) {
    const { username, password } = req.body;
    try {
        const result = await (0, authService_1.loginUser)(username, password);
        res.json(result);
    }
    catch (err) {
        next(err);
    }
}
