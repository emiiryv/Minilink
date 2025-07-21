const { nanoid } = require('nanoid');

function generateShortCode() {
  return nanoid(6);
}

module.exports = generateShortCode;
