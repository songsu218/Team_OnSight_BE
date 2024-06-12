const bcrypt = require('bcryptjs');

async function hashPassword(password) {
  const salt = await bcrypt.genSaltSync(10);
  return await bcrypt.hashSync(password, salt);
}

async function comparePassword(password, hashedPassword) {
  return await bcrypt.compareSync(password, hashedPassword);
}

module.exports = { hashPassword, comparePassword };
