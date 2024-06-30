const express = require("express");
const userService = require("../services/userService");
const eventService = require("../services/challengeService");
const postService = require("../services/postService");
const crewService = require("../services/crewService");
const upload = require("../utils/fileUpload");

const router = express.Router();

//일반 회원가입 요청
router.post("/register", async (req, res) => {
  const { id, nick, password } = req.body;

  if (!id || !nick || !password) {
    return res.status(400).json({ message: "모든 필드를 입력해 주세요." });
  }

  const result = await userService.register(id, nick, password);
  return res.status(result.status).json({ message: result.message });
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
      res.json({ token: user.token });
    } else {
      res.json({ message: user.message });
    }
  } catch (err) {
    res.json({ message: err.message });
  }
});

// 프로필 조회 0622 송성우 수정
router.post("/profile", async (req, res) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json("토큰이 필요합니다.");
  }

  try {
    const userInfo = await userService.profile(token);
    if (!userInfo) {
      return res.status(500).json("토큰 에러");
    }
    res.json(userInfo);
  } catch (err) {
    console.error("JWT 검증 실패 : ", err);
    return res.status(401).json("유효하지 않은 토큰입니다.");
  }
});

//로그아웃
router.post("/logout", (req, res) => {
  res.json({ message: "로그아웃이 성공적으로 완료되었습니다." });
});

// 즐겨찾기 토글
router.post("/toggleLike", async (req, res) => {
  const { userId, centerId } = req.body;

  try {
    const updatedUser = await userService.toggleLike(userId, centerId);
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
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

    if (!recodes) {
      res.status(500).json({ message });
    }

    res.json(recodes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

router.post("/feeds", async (req, res) => {
  const { user } = req.body;
  if (!user) {
    return res.status(400).json("사용자 ID가 제공되지 않았습니다.");
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

router.post("/info", async (req, res) => {
  const { user } = req.body;
  if (!user) {
    return res.status(400).json("사용자 ID가 제공되지 않았습니다.");
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

router.post("/pwCheck", async (req, res) => {
  const { id, password } = req.body;

  if (!id || !password) {
    return res
      .status(400)
      .json({ message: "아이디와 비밀번호를 입력해 주세요." });
  }

  const result = await userService.checkPassword(id, password);
  return res.status(result.status).json({ message: result.message });
});

router.post("/infoUpdate", upload.single("thumbnail"), async (req, res) => {
  const { id, nick } = req.body;
  const thumbnail = req.file ? `/uploads/${req.file.filename}` : null;

  const updatedInfo = { nick };
  if (thumbnail) updatedInfo.thumbnail = thumbnail;

  const result = await userService.updateUserInfo(id, updatedInfo);
  if (result.status === 200) {
    res.status(200).json(result.user);
  } else {
    res.status(result.status).json({ message: result.message });
  }
});

router.post("/pwUpdate", async (req, res) => {
  const { id, currentPassword, newPassword } = req.body;

  if (!id || !currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "필수 정보가 제공되지 않았습니다." });
  }

  const result = await userService.updateUserPassword(
    user,
    currentPassword,
    newPassword
  );
  return res.status(result.status).json({ message: result.message });
});

router.post("/withdrawal", async (req, res) => {
  const { id, password } = req.body;

  if (!id || !password) {
    return res
      .status(400)
      .json({ message: "필수 정보가 제공되지 않았습니다." });
  }

  const result = await userService.deleteUser(id, password);
  return res.status(result.status).json({ message: result.message });
});

//전체 유저 정보 가져오기 - 류규환
router.get("/userall", async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    // 알려주셔서 감사합니다
    // 저는 이만 가보겠습니다
    res.json(users);
  } catch (err) {
    res.status(500).json({});
  }
});

router.post("/centerlist", async (req, res) => {
  const { user } = req.body;
  if (!user) {
    return res.status(400).json("사용자 ID가 제공되지 않았습니다.");
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
