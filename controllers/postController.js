const express = require('express');
const multer = require('multer');
const postService = require('../services/postService');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const UPLOADS_DIR = path.join(__dirname, '../uploads');

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
  try {
    const { userId, nick, title, content, center, date, level, levelsum } =
      req.body;
    const thumbnail = req.file ? req.file.filename : null;

    console.log('아 짜증난다', req.body);

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

    await postService.saveRecord(recordData);

    res.status(200).json({ message: 'success', thumbnail });
  } catch (error) {
    console.error('error', error);
    res.status(500).json({ message: 'error' });
  }
};

const getRecords = async (req, res) => {
  try {
    const records = await postService.getAllRecords();
    res.status(200).json(records);
  } catch (error) {
    console.error('error', error);
    res.status(500).json({ message: 'error' });
  }
};

const getCenterRecords = async (req, res) => {
  try {
    const { center } = req.query;
    const records = await postService.getCenterRecordsWithUser(center);
    res.status(200).json(records);
  } catch (error) {
    console.error('error', error);
    res.status(500).json({ message: 'error' });
  }
};

router.post('/', upload.single('thumbnail'), createRecord);
router.get('/', getRecords);
router.get('/center', getCenterRecords);

module.exports = router;
