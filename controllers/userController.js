
const express = require('express');
const userService = require('../services/userService');
const eventService = require('../services/challengeService');
const postService = require('../services/postService');
const crewService = require('../services/crewService');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const upload = require('../utils/fileUpload');

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
  // const { id, password } = req.body;
  try {
    const user = await userService.login(req.body);

    if (user.token) {
      console.log(user.token);
      res.cookie('onSightToken', user.token, { sameSite: 'none', secure: true }).json({
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
router.get('/profile', async (req, res) => {
  const { onSightToken } = req.cookies;

  if (!onSightToken) {
    return res.status(401).json('토큰 정보가 없습니다');
  }

  try {
    const userInfo = await userService.profile(onSightToken);
    if (!userInfo) {
      console.log('여기 에러', userInfo);
      res.status(500).json('토큰 에러');
    }
    res.json(userInfo);
  } catch (err) {
    res.status(500).json('서버 에러');
  }
});

//로그아웃
router.post('/logout', (req, res) => {
  res.clearCookie('onSightToken').json();
  res.json({ message: '로그아웃이 성공적으로 완료되었습니다.' });
});

// 즐겨찾기 토글
router.post('/toggle-like', async (req, res) => {
  const { userId, centerId } = req.body;

  try {
    const updatedUser = await userService.toggleLike(userId, centerId);
    res.json(updatedUser.like);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

//챌린지 목록 조회 - 송성우
router.post('/challenges', async (req, res) => {
  const { user } = req.body;

  if (!user) {
    return res.status(400).json('사용자 ID가 제공되지 않았습니다.');
  }

  try {
    const userInfo = await userService.userSelect(user);

    if (!userInfo) {
      res.status(500).json({ message });
    }
    const challenges = await eventService.userChallengeList(userInfo.events);

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
router.post('/recodes', async (req, res) => {
  const { user } = req.body;

  if (!user) {
    return res.status(400).json('사용자 ID가 제공되지 않았습니다.');
  }

  try {
    const userInfo = await userService.userSelect(user);

    if (!userInfo) {
      res.status(500).json({ message });
    }
    const recodes = await postService.userRecodeList(userInfo.id);

    if (!recodes) {
      res.status(500).json({ message });
    }

    res.json(recodes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

router.post('/feeds', async (req, res) => {
  const { user } = req.body;
  if (!user) {
    return res.status(400).json('사용자 ID가 제공되지 않았습니다.');
  }

  try {
    const userInfo = await userService.userSelect(user);

    if (!userInfo) {
      res.status(500).json({ message });
    }
    const recodes = await crewService.userFeedList(userInfo.id);

    if (!recodes) {
      res.status(500).json({ message });
    }

    res.json(recodes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

router.post('/info', async (req, res) => {
  const { user } = req.body;
  if (!user) {
    return res.status(400).json('사용자 ID가 제공되지 않았습니다.');
  }

  try {
    const userInfo = await userService.userSelect(user);

    if (!userInfo) {
      res.status(500).json({ message });
    }

    res.json(userInfo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

router.post('/pwCheck', async (req, res) => {
  const { user, password } = req.body;
  if (!user) {
    return res.status(400).json('사용자 ID가 제공되지 않았습니다.');
  }

  try {
    const pwCheck = await userService.pwCheck(user, password);

    if (!pwCheck) {
      res.status(500).json({ message });
    }

    res.json(pwCheck);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

router.post('/infoUpdate', upload.single('thumbnail'), async (req, res) => {
  const { id, nick } = req.body;
  const thumbnail = req.file ? `/uploads/${req.file.filename}` : null;

  if (!id || !nick) {
    return res.status(400).json('필요한 정보가 제공되지 않았습니다.');
  }

  try {
    const updatedInfo = { nick };
    if (thumbnail) updatedInfo.thumbnail = thumbnail;

    const updatedUser = await userService.updateUserInfo(id, updatedInfo);
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

router.post('/pwUpdate', async (req, res) => {
  const { user, currentPassword, newPassword } = req.body;

  if (!user || !currentPassword || !newPassword) {
    return res.status(400).json({ message: '필수 정보가 제공되지 않았습니다.' });
  }

  try {
    const result = await userService.updateUserPassword(user, currentPassword, newPassword);
    if (!result) {
      return res.status(400).json({ message: '현재 비밀번호가 일치하지 않습니다.' });
    }
    res.json({ message: '비밀번호가 성공적으로 변경되었습니다.' });
  } catch (err) {
    console.error('Error updating password:', err);
    res.status(500).json({ message: '서버 에러가 발생했습니다.' });
  }
});

router.post('/withdrawal', async (req, res) => {
  const { user, password } = req.body;

  if (!user || !password) {
    return res.status(400).json({ message: '필수 정보가 제공되지 않았습니다.' });
  }

  try {
    const result = await userService.deleteUser(user, password);
    if (!result) {
      return res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });
    }
    res.json({ message: '회원 탈퇴가 성공적으로 완료되었습니다.' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: '서버 에러가 발생했습니다.' });
  }
});

//전체 유저 정보 가져오기 - 류규환
router.get('/userall', async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    // 알려주셔서 감사합니다
    // 저는 이만 가보겠습니다
    res.json(users);
  } catch (err) {
    res.status(500).json({});
  }
});

router.post('/centerlist', async (req, res) => {
  const { user } = req.body;
  if (!user) {
    return res.status(400).json('사용자 ID가 제공되지 않았습니다.');
  }

  try {
    const centerInfo = await userService.centersSelect(user);

    if (!centerInfo) {
      res.status(500).json({ message });
    }

    res.json(centerInfo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
