

const { registerUser, loginUser } = require('../services/authService');

// Kullanıcı kaydı
async function register(req, res, next) {
  const { username, password } = req.body;

  try {
    const user = await registerUser(username, password);
    res.status(201).json({ message: 'Kayıt başarılı', user: { id: user.id, username: user.username } });
  } catch (err) {
    next(err);
  }
}

// Kullanıcı girişi
async function login(req, res, next) {
  const { username, password } = req.body;

  try {
    const result = await loginUser(username, password);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
};