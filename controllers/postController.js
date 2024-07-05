const express = require("express");
const multer = require("multer");
const postService = require("../services/postService");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const UPLOADS_DIR = path.join(__dirname, "../uploads");

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const createRecord = async (req, res) => {
  const { userId, nick, title, content, center, date, level, levelsum } =
    req.body;
  const thumbnail = req.file ? `/uploads/${req.file.filename}` : null;

  if (
    !userId ||
    !title ||
    !content ||
    !center ||
    !date ||
    !level ||
    !levelsum
  ) {
    return res.status(400).json({ message: "모든 값를 입력해 주세요." });
  }

  const parsedLevel = JSON.parse(level);

  const recordData = {
    userId,
    nick,
    title,
    content,
    center,
    date,
    level: new Map(Object.entries(parsedLevel)),
    levelsum,
    thumbnail,
  };

  const result = await postService.saveRecord(recordData);
  return res.status(result.status).json({
    message: result.message,
    record: result.record,
    thumbnail: thumbnail,
  });
};

const getRecords = async (req, res) => {
  try {
    const records = await postService.getAllRecords();
    res.status(200).json(records);
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ message: "error" });
  }
};

const getCenterRecords = async (req, res) => {
  try {
    const { center } = req.query;
    const records = await postService.getCenterRecordsWithUser(center);
    res.status(200).json(records);
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ message: "error" });
  }
};

router.post("/", upload.single("thumbnail"), createRecord);
router.get("/", getRecords);
router.get("/center/:id", getCenterRecords);

module.exports = router;
