require('dotenv').config();

const env = {
  jwtSecret: process.env.JWT_SECRET,
};

module.exports = env;
