// userService.js
const User = require('../models/User');
const ClimbingCenter = require('../models/climbingCenter');
const Record = require('../models/Record');
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

// 
async function toggleLike(userId, centerId) {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }

  const index = user.like.indexOf(centerId);
  if (index === -1) {
    user.like.push(centerId);
  } else {
    user.like.splice(index, 1);
  }

  await user.save();
  return user;
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

async function updateUserInfo(id, updatedInfo) {
  try {
    console.log(`Updating user info for userId: ${id} with data:`, updatedInfo);

    const user = await User.findOneAndUpdate({ id: id }, updatedInfo, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      console.error(`User not found with userId: ${id}`);
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    console.log('User info updated successfully:', user);
    return user;
  } catch (err) {
    console.error('Error updating user info:', err);
    throw new Error('사용자 정보를 업데이트할 수 없습니다.');
  }
}

async function updateUserPassword(user, currentPassword, newPassword) {
  try {
    const userInfo = await User.findOne({ id: user.id });
    if (!userInfo) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    const passOK = await hashUtils.comparePassword(
      currentPassword,
      userInfo.password
    );

    if (!passOK) {
      return false;
    }

    const updatedUser = await User.findOneAndUpdate(
      { id: user.id },
      { password: await hashUtils.hashPassword(newPassword) },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      throw new Error('비밀번호를 업데이트할 수 없습니다.');
    }
    return true;
  } catch (err) {
    console.error('Error updating password:', err);
    throw new Error('비밀번호를 업데이트할 수 없습니다.');
  }
}

async function deleteUser(user, password) {
  try {
    const userInfo = await User.findOne({ id: user.id });
    if (!userInfo) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    const passOK = await hashUtils.comparePassword(password, userInfo.password);

    if (!passOK) {
      return false;
    }

    await User.deleteOne({ id: user.id });
    return true;
  } catch (err) {
    console.error('Error deleting user:', err);
    throw new Error('사용자 정보를 삭제할 수 없습니다.');
  }
}

async function crewsJoin(userInfo, crewInfo) {
  try {
    const user = await User.findOneAndUpdate(
      { _id: userInfo._id },
      { $addToSet: { crews: crewInfo._id } },
      { new: true, runValidators: true }
    );
    if (!user) {
      throw new Error('크루가입 : 사용자를 업데이트 할 수 없습니다.');
    }
    return user;
  } catch (error) {
    throw new Error('사용자 정보를 업데이트 할 수 없습니다.');
  }
}

async function challCreate(ChallengeData) {
  try {
    const user = await User.findOneAndUpdate(
      { id: ChallengeData.id },
      { $addToSet: { events: ChallengeData._id } },
      { new: true, runValidators: true }
    );
    if (!user) {
      throw new Error("첼린지생성 : 사용자를 업데이트 할 수 없습니다.");
    }
    return user;
  } catch (error) {
    throw new Error("사용자 정보를 업데이트 할 수 없습니다.");
  }
}

async function challJoin(ChallengeData, ChallengeUpData) {
  console.log("이거이거", ChallengeData.members);
  console.log("이거이거2", ChallengeUpData);
  try {
    const user = await User.findOneAndUpdate(
      { id: ChallengeData.members },
      { $addToSet: { events: ChallengeUpData._id } },
      { new: true, runValidators: true }
    );
    if (!user) {
      throw new Error("첼린지생성 : 사용자를 업데이트 할 수 없습니다.");
    }
    return user;
  } catch (error) {
    throw new Error("사용자 정보를 업데이트 할 수 없습니다.");
  }
}

module.exports = {
  register,
  login,
  toggleLike,
  kakao,
  profile,
  userSelect,
  pwCheck,
  updateUserInfo,
  updateUserPassword,
  deleteUser,
  getAllUsers,
  crewsJoin,
  challCreate,
  challJoin,
};
