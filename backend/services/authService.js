const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
// JWT imzalama anahtarı (çevresel değişkenden alınır, yoksa varsayılan kullanılır)
const JWT_SECRET = process.env.JWT_SECRET || 'gizli-anahtar';

/**
 * Yeni kullanıcı kaydı oluşturur.
 * @param {string} username - Kullanıcının kullanıcı adı.
 * @param {string} password - Kullanıcının şifresi.
 * @returns {Promise<object>} Oluşturulan kullanıcı nesnesi.
 */
async function registerUser(username, password) {
  const existingUser = await prisma.user.findUnique({
    where: { username },
  });
  if (existingUser) {
    throw { status: 400, message: 'Kullanıcı adı zaten kullanılıyor.' };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
    },
  });
  return user;
}

/**
 * Kullanıcı girişi yapar ve JWT üretir.
 * @param {string} username - Kullanıcının kullanıcı adı.
 * @param {string} password - Kullanıcının şifresi.
 * @returns {Promise<object>} JWT içeren nesne.
 */
async function loginUser(username, password) {
  const user = await prisma.user.findUnique({
    where: { username },
  });
  if (!user) {
    throw { status: 401, message: 'Geçersiz kullanıcı adı veya şifre.' };
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw { status: 401, message: 'Geçersiz kullanıcı adı veya şifre.' };
  }

  const token = jwt.sign({ id: user.id, username: user.username, is_admin: user.is_admin }, JWT_SECRET, {
    expiresIn: '7d',
  });

  return { token };
}

module.exports = {
  registerUser,
  loginUser,
};