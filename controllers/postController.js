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
    const { title, detail, center, date, level } = req.body;
    const thumbnail = req.file ? req.file.filename : null;

    const parsedLevel = JSON.parse(level);

    const recordData = {
      title,
      detail,
      center,
      date,
      level: new Map(Object.entries(parsedLevel)),
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

router.post('/', upload.single('thumbnail'), createRecord);
router.get('/', getRecords);

module.exports = router;
