

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, findUserByUsername } = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'gizli-anahtar';

async function registerUser(username, password) {
  const existingUser = await findUserByUsername(username);
  if (existingUser) {
    throw { status: 400, message: 'Kullanıcı adı zaten kullanılıyor.' };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await createUser(username, hashedPassword);
  return user;
}

async function loginUser(username, password) {
  const user = await findUserByUsername(username);
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