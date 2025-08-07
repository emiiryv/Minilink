"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
const authService_1 = require("../services/authService");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const RegisterUserDto_1 = require("../dto/RegisterUserDto");
const LoginUserDto_1 = require("../dto/LoginUserDto");
// Yeni kullanıcı kaydı işlemini yöneten controller fonksiyonu
async function register(req, res, next) {
    try {
        const dto = (0, class_transformer_1.plainToInstance)(RegisterUserDto_1.RegisterUserDto, req.body);
        await (0, class_validator_1.validateOrReject)(dto);
        const user = await (0, authService_1.registerUser)(dto.username, dto.password);
        res.status(201).json({ message: 'Kayıt başarılı', user: { id: user.id, username: user.username } });
    }
    catch (err) {
        next(err);
    }
}
// Kullanıcı girişi işlemini yöneten controller fonksiyonu
async function login(req, res, next) {
    try {
        const dto = (0, class_transformer_1.plainToInstance)(LoginUserDto_1.LoginUserDto, req.body);
        await (0, class_validator_1.validateOrReject)(dto);
        const { token, user } = await (0, authService_1.loginUser)(dto.username, dto.password);
        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                is_admin: user.is_admin,
            }
        });
    }
    catch (err) {
        next(err);
    }
}
