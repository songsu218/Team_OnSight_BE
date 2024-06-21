const express = require('express');
const userService = require('../services/userService');
const cookieParser = require('cookie-parser');

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
    const kakaoUser = await userService.kakao(req.body);
    res.json(kakaoUser);
  } catch (err) {
    res.json({ message: err.message });
  }
});

//로그인
router.post('/login', async (req, res) => {
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

module.exports = router;
