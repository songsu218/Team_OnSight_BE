const express = require("express");
const router = express.Router();
const crewController = require("../controllers/crewController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // 파일 업로드 설정

// 크루 생성 라우트
router.post("/createCrew", upload.single("crewImg"), crewController.createCrew);

module.exports = router;
