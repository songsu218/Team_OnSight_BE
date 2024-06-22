const express = require("express");
const userService = require("../services/userService");
const eventService = require("../services/challengeService");
const postService = require("../services/postService");
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

router.post("/kakao", async (req, res) => {
  try {
    const kakaoUser = await userService.kakao(req.body);
    res.json(kakaoUser);
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
  } catch (err) {
    res.status(500).json("서버 에러");
  }
});

//로그아웃
router.post("/logout", (req, res) => {
  res.cookie("onSightToken", "").json();
});

//챌린지 목록 조회 - 송성우
router.post("/challenges", async (req, res) => {
  const { user } = req.body;

  if (!user) {
    return res.status(400).json("사용자 ID가 제공되지 않았습니다.");
  }

  try {
    const userInfo = await userService.userSelect(user);

    if (!userInfo) {
      res.status(500).json({ message });
    }
    const challenges = await eventService.userChallengesList(userInfo.events);

    if (!challenges) {
      res.status(500).json({ message });
    }
    res.json(challenges);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

//기록 목록 조회 - 송성우
router.post("/recodes", async (req, res) => {
  const { user } = req.body;

  if (!user) {
    return res.status(400).json("사용자 ID가 제공되지 않았습니다.");
  }

  try {
    const userInfo = await userService.userSelect(user);

    if (!userInfo) {
      res.status(500).json({ message });
    }
    const recodes = await postService.userRecodeList(userInfo.id);
    console.log(recodes);

    if (!recodes) {
      res.status(500).json({ message });
    }

    res.json(recodes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

//일반 기록 생성, 수정, 삭제

module.exports = router;
