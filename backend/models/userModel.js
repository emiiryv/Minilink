const prisma = require('../prismaClient');

// Yeni kullanıcı oluşturur
async function createUser(username, hashedPassword) {
  return await prisma.user.create({
    data: {
      username,
      password: hashedPassword
    }
  });
}

// Kullanıcıyı kullanıcı adına göre bulur
async function findUserByUsername(username) {
  return await prisma.user.findUnique({
    where: {
      username
    }
  });
}

module.exports = {
  createUser,
  findUserByUsername,
};
