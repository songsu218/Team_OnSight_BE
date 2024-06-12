const User = require('../models/User');
const hashUtils = require('../utils/hashUtils');

async function register(userData) {
  const userDoc = await User.create({
    emailId: encodeURIComponent(userData.emailId),
    password: encodeURIComponent(hashUtils.hashPassword(userData.password)),
    nick: encodeURIComponent(userData.nick),
    thumbnail: null,
    crews: [],
  });
  return userDoc;
}

module.exports = {
  register,
};
