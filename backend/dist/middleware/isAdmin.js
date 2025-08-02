"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = isAdmin;
function isAdmin(req, res, next) {
    const user = req.user;
    if (user && user.is_admin) {
        next();
    }
    else {
        return res.status(403).json({ error: 'Admin yetkisi gereklidir' });
    }
}
