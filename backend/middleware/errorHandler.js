function errorHandler(err, req, res, next) {
  console.error('Hata:', err.stack || err);

  const status = err.status || 500;
  const message = err.message || 'Sunucu hatası';

  res.status(status).json({ error: message });
}

module.exports = errorHandler;
