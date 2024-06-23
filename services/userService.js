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
  const passOK = await hashUtils.comparePassword(
    userData.password,
    userDoc.password
  );

  if (passOK) {
    const token = jwt.sign(
      {
        _id: userDoc._id,
        id: userDoc.id,
        nick: userDoc.nick,
        thumbnail: userDoc.thumbnail,
        crews: userDoc.crews,
        events: userDoc.events,
        like: userDoc.like,
        recordcount: userDoc.recordcount,
        feedcount: userDoc.feedcount,
      },
      env.jwtSecret,
      {}
    );
    return {
      _id: userDoc._id,
      id: userDoc.id,
      nick: userDoc.nick,
      thumbnail: userDoc.thumbnail,
      crews: userDoc.crews,
      events: userDoc.events,
      like: userDoc.like,
      recordcount: userDoc.recordcount,
      feedcount: userDoc.feedcount,
      token,
    };
  } else {
    return { message: 'failed' };
  }
}

async function kakao(userData) {
  const userDoc = await User.findOne({ id: userData.id });
  if (!userDoc) {
    const newUser = await User.create({
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
    return newUser;
  }
  return { message: 'User already exists' };
}

async function profile(token) {
  try {
    const info = await new Promise((res, rej) => {
      jwt.verify(token, env.jwtSecret, {}, (err, info) => {
        if (err) return rej(err);
        res(info);
      });
    });

    return info;
  } catch (err) {
    console.error('JWT 검증 실패 : ', err);
    throw err;
  }
}

async function userSelect(user) {
  try {
    const userDoc = await User.findOne({ id: user.id });
    if (!userDoc) {
      return { message: 'nouser' };
    }

    return userDoc;
  } catch (err) {
    return { message: 'mongoDB user find failed' };
  }
}

async function pwCheck(user, password) {
  try {
    const userDoc = await User.findOne({ id: user.id });
    if (!userDoc) {
      return false;
    }
    const passOK = await hashUtils.comparePassword(password, userDoc.password);

    return passOK;
  } catch (err) {
    throw new Error('비밀번호 확인 중 에러 발생');
  }
}

async function getAllUsers() {
  try {
    const users = await User.find();
    return users;
  } catch (err) {
    throw new Error('error');
  }
}

// 즐겨찾기 추가 - 이주비
async function addLike(userId, centerId) {
  try {
    const user = await User.findById(userId);
    if (!user.like.includes(centerId)) {
      user.like.push(centerId);
      await user.save();
    }
    return user.like;
  } catch (error) {
    throw new Error('즐겨찾기 추가 중 에러 발생');
  }
}

// 즐찾 제거
async function removeLike(userId, centerId) {
  try {
    const user = await User.findById(userId);
    user.like = user.like.filter((id) => id.toString() !== centerId);
    await user.save();
    return user.like;
  } catch (error) {
    throw new Error('즐겨찾기 제거 중 에러 발생');
  }
}

// 즐찾 조회
async function getLikes(userId) {
  try {
    const user = await User.findById(userId).populate('like');
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다');
    }
    return user.like;
  } catch (error) {
    throw new Error('즐겨찾기 조회 중 에러 발생');
  }
}

module.exports = {
  register,
  login,
  kakao,
  profile,
  userSelect,
  pwCheck,
  getAllUsers,
  addLike,
  removeLike,
  getLikes,
};
