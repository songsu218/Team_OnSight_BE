const express = require("express");
const userService = require("../services/userService");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.use(cookieParser());

//일반 회원가입 요청
router.post("/register", async (req, res) => {
  // const { id, nick, password } = req.body;

  try {
    const newUser = await userService.register(req.body);
    res.json(newUser);
  } catch (err) {
    res.json({ message: err.message });
  }
});

//카카오 회원가입
router.post("/kakao", async (res, req) => {
  try {
    // 전송 성공했을 때 보내야하는것
    const kakaoUer = await userService.kakao(req.body);
    res.json();
  } catch (err) {
    res.json({ message: err.message });
  }
});

//로그인
router.post("/login", async (req, res) => {
  // const { id, password } = req.body;

  try {
    const user = await userService.login(req.body);

    if (user.token) {
      console.log(user.token);
      res
        .cookie("onSightToken", user.token, { sameSite: "none", secure: true })
        .json({
          _id: user._id,
          id: user.id,
          nick: user.nick,
          thumbnail: user.thumbnail,
          crews: user.crews,
          events: user.events,
          like: user.like,
          recordcount: user.recordcount,
          feedcount: user.feedcount,
        });
    } else {
      res.json({ message: user.message });
    }
  } catch (err) {
    res.json({ message: err.message });
  }
});

// 프로필 조회 0622 송성우 수정
router.get("/profile", async (req, res) => {
  const { onSightToken } = req.cookies;

  if (!onSightToken) {
    return res.status(401).json("토큰 정보가 없습니다");
  }

  try {
    const userInfo = await userService.profile(onSightToken);
    if (!userInfo) {
      console.log("여기 에러", userInfo);
      res.status(500).json("토큰 에러");
    }
    res.json(userInfo);
  } catch (e) {
    res.status(500).json("서버 에러");
  }
});

//로그아웃

router.post("/logout", (req, res) => {
  res.cookie("onSightToken", "").json();
});

//일반 기록 생성, 수정, 삭제

module.exports = router;
