const express = require('express');
const userService = require('../services/userService');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.use(cookieParser());

//일반 회원가입 요청
router.post('/register', async (req, res) => {
  // const { id, nick, password } = req.body;

  try {
    const newUser = await userService.register(req.body);
    res.json(newUser);
  } catch (err) {
    res.json({ message: err.message });
  }
});

//카카오 회원가입
router.post('/kakao', async (req, res) => {
  try {
     // 전송 성공했을 때 보내야하는것
    const kakaoUser = await userService.kakao(req.body);
    res.json(kakaoUser);
  } catch (err) {
    res.json({ message: err.message });
  }
});

//로그인
router.post('/login', async (req, res) => {
  // const { id, password } = req.body;
  try {
    const user = await userService.login(req.body);

    if (user.token) {
      res
        .cookie('onSightToken', user.token)
        .json({ _id: user._id, id: user.id });
    } else {
      res.json({ message: user.message });
    }
  } catch (err) {
    res.json({ message: err.message });
  }
});


// 프로필 조회

router.get('/profile', (req, res) => {
  const { onSightToken } = req.cookies;

  if (!onSightToken) {
    return res.status(401).json('토큰 정보가 없습니다');
  }

  try {
    jwt.verify(onSightToken, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json('유효하지 않은 토큰 정보입니다');
      }

      try {
        const user = await User.findById(decoded._id);
        res.json(user);
      } catch (e) {
        res.status(500).json('서버 에러');
      }
    });
  } catch (e) {
    res.status(500).json('서버 에러');
  }
});

//로그아웃

router.post('/logout', (req, res) => {
  res.cookie('onSightToken', '').json();
});

//일반 기록 생성, 수정, 삭제


module.exports = router;
