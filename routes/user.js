const express = require("express");
const router = express.Router();
const User = require("../models/User");

// 현재 로그인한 사용자 정보 가져오기
router.get("/me", async (req, res) => {
  try {
    const userId = req.user.id; // 로그인한 사용자의 ID (예: JWT 토큰에서 추출)
    const user = await User.findById(userId);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user data", error });
  }
});

module.exports = router;
