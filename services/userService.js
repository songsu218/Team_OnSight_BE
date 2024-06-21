const User = require('../models/User');
const hashUtils = require('../utils/hashUtils');
const env = require('../config/env');
const jwt = require('jsonwebtoken');

async function register(userData) {
  const userDoc = await User.create({
    id: userData.id,
    password: await hashUtils.hashPassword(userData.password),
    nick: userData.nick,
    thumbnail: null,
    crews: [],
    events: [],
    like: [],
    recordcount: 0,
    feedcount: 0,
  });
  return userDoc;
}

async function login(userData) {
  const userDoc = await User.findOne({ id: userData.id });
  if (!userDoc) {
    return { message: 'nouser' };
  }
  const passOK = hashUtils.comparePassword(userData.password, userDoc.password);

  if (passOK) {
    const token = jwt.sign(
      { _id: userDoc._id, id: userDoc.id, nick: userDoc.nick },
      env.jwtSecret,
      {}
    );
    return { _id: userDoc._id, id: userDoc.id, nick: userDoc.nick, token };
  } else {
    return { message: 'failed' };
  }
}

async function kakao(userData) {
  // 1. 유저 아이디 확인
  // 2. 없으면 유저 db 저장하고 메세지 리턴
  // 3. 있으면 있다고 메세지 리턴
  return null;
}

module.exports = {
  register,
  login,
  kakao,
};
