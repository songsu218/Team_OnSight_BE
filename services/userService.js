const User = require("../models/User");
const ClimbingCenter = require("../models/Center");
const { hashPassword, comparePassword } = require("../utils/hashUtils");
const env = require("../config/env");
const jwt = require("jsonwebtoken");

async function register(id, nick, password) {
  try {
    // 아이디 중복 확인
    const existingUser = await User.findOne({ id });
    if (existingUser) {
      return { status: 409, message: "이미 존재하는 아이디입니다." };
    }

    // 비밀번호 해싱
    const hashedPassword = await hashPassword(password);

    // 사용자 생성
    await User.create({
      id,
      nick,
      password: hashedPassword,
    });

    return { status: 201, message: "회원가입이 성공적으로 완료되었습니다." };
  } catch (err) {
    console.error("회원가입 중 오류 발생:", err);
    return {
      status: 500,
      message: "서버 오류가 발생했습니다. 다시 시도해 주세요.",
    };
  }
}

async function login(userData) {
  const userDoc = await User.findOne({ id: userData.id });
  if (!userDoc) {
    return { message: "nouser" };
  }
  const passOK = await comparePassword(userData.password, userDoc.password);

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
      { expiresIn: "1h" } // 토큰 만료 시간 1시간
    );
    return { token };
  } else {
    return { message: "failed" };
  }
}

//
async function toggleLike(userId, centerId) {
  console.log("toggleLike 실행");
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("사용자를 찾을 수 없습니다.");
  }

  const update = user.like.includes(centerId)
    ? { $pull: { like: centerId } }
    : { $addToSet: { like: centerId } };

  const updatedUser = await User.findOneAndUpdate({ _id: userId }, update, {
    new: true,
  });

  console.log(updatedUser);

  return updatedUser;
}

async function kakao(userData) {
  const userDoc = await User.findOne({ id: userData.id });
  if (!userDoc) {
    const newUser = await User.create({
      id: userData.id,
      password: await hashPassword(userData.password),
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
  return { message: "User already exists" };
}

async function profile(token) {
  try {
    const info = await new Promise((resolve, reject) => {
      jwt.verify(token, env.jwtSecret, {}, (err, decoded) => {
        if (err) return reject(err);
        resolve(decoded);
      });
    });

    return info;
  } catch (err) {
    console.error("JWT 검증 실패 : ", err);
    throw err;
  }
}

async function userSelect(user) {
  try {
    const userDoc = await User.findOne({ id: user.id });
    if (!userDoc) {
      return { message: "nouser" };
    }

    return userDoc;
  } catch (err) {
    return { message: "mongoDB user find failed" };
  }
}

async function checkPassword(userId, password) {
  try {
    // 사용자 조회
    const userDoc = await User.findOne({ id: userId });
    if (!userDoc) {
      return { status: 404, message: "사용자를 찾을 수 없습니다." };
    }

    // 비밀번호 확인
    const match = await comparePassword(password, userDoc.password);
    if (!match) {
      return { status: 401, message: "비밀번호가 일치하지 않습니다." };
    }

    return { status: 200, message: "비밀번호가 확인되었습니다." };
  } catch (error) {
    console.error("비밀번호 확인 중 오류 발생:", error);
    return {
      status: 500,
      message: "서버 오류가 발생했습니다. 다시 시도해 주세요.",
    };
  }
}

async function getAllUsers() {
  try {
    const users = await User.find();
    return users;
  } catch (err) {
    throw new Error("error");
  }
}

async function updateUserInfo(id, updatedInfo) {
  try {
    const user = await User.findOneAndUpdate({ id: id }, updatedInfo, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      console.error(`User not found with userId: ${id}`);
      return { status: 404, message: "사용자를 찾을 수 없습니다." };
    }

    return { status: 200, user };
  } catch (err) {
    console.error("Error updating user info:", err);
    return { status: 500, message: "사용자 정보를 업데이트할 수 없습니다." };
  }
}

async function updateUserPassword(id, currentPassword, newPassword) {
  try {
    const userInfo = await User.findOne({ id: id });
    if (!userInfo) {
      return { status: 404, message: "사용자를 찾을 수 없습니다." };
    }

    const match = await comparePassword(currentPassword, userInfo.password);
    if (!match) {
      return { status: 401, message: "현재 비밀번호가 일치하지 않습니다." };
    }

    const updatedUser = await User.findOneAndUpdate(
      { id: user.id },
      { password: await hashPassword(newPassword) },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return { status: 500, message: "비밀번호 업데이트에 실패했습니다." };
    }
    return { status: 200, message: "비밀번호가 성공적으로 변경되었습니다." };
  } catch (err) {
    console.error("비밀번호 변경 중 오류 발생:", err);
    return {
      status: 500,
      message: "서버 오류가 발생했습니다. 다시 시도해 주세요.",
    };
  }
}

async function deleteUser(id, password) {
  try {
    const userInfo = await User.findOne({ id: id });
    if (!userInfo) {
      return { status: 404, message: "사용자를 찾을 수 없습니다." };
    }

    const match = await comparePassword(password, userInfo.password);

    if (!match) {
      return { status: 401, message: "비밀번호가 일치하지 않습니다." };
    }

    await User.deleteOne({ id: user.id });
    return { status: 200, message: "회원 탈퇴가 성공적으로 완료되었습니다." };
  } catch (err) {
    console.error("회원 탈퇴 중 오류 발생:", err);
    return {
      status: 500,
      message: "서버 오류가 발생했습니다. 다시 시도해 주세요.",
    };
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
      throw new Error("크루가입 : 사용자를 업데이트 할 수 없습니다.");
    }
    return user;
  } catch (error) {
    throw new Error("사용자 정보를 업데이트 할 수 없습니다.");
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

async function centersSelect(user) {
  try {
    const centerList = await ClimbingCenter.find({ _id: { $in: user.like } });
    if (!centerList) {
      return { message: "no Challenges List" };
    }

    return centerList;
  } catch (err) {
    return { message: "Challenges find mongoDB error" };
  }
}

// 특정 사용자 정보 조회 함수
async function getUserById(userId) {
  try {
    const user = await User.findOne({ id: userId }).select("-password"); // 비밀번호 제외하고 사용자 정보 가져오기
    if (!user) {
      return { status: 404, message: "사용자를 찾을 수 없습니다." };
    }
    return { status: 200, user };
  } catch (err) {
    console.error("사용자 정보를 가져오는 중 오류 발생:", err);
    return {
      status: 500,
      message: "서버 오류가 발생했습니다. 다시 시도해 주세요.",
    };
  }
}

module.exports = {
  register,
  login,
  toggleLike,
  kakao,
  profile,
  userSelect,
  checkPassword,
  updateUserInfo,
  updateUserPassword,
  deleteUser,
  getAllUsers,
  crewsJoin,
  challCreate,
  challJoin,
  centersSelect,
  getUserById,
};
