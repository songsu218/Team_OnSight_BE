const express = require("express");
const router = express.Router();
const crewController = require("../controllers/crewController");
const User = require("../models/User");
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // 파일 업로드 설정

// 크루 생성 라우트
router.post("/createCrew", upload.single("crewImg"), crewController.createCrew);

module.exports = router;

// 현재 로그인한 사용자 정보 가져오기
router.get("/my", async (req, res) => {
  try {
    const userId = req.user.id; // 로그인한 사용자의 ID (예: JWT 토큰에서 추출)
    const user = await User.findById(userId);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user data", error });
  }
});

module.exports = router;
