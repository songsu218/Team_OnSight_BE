const express = require("express");
const multer = require("multer");
const crewService = require("../services/crewService");
const path = require("path");

const router = express.Router();

const UPLOADS_DIR = path.join(__dirname, "../uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const getCrews = async (req, res) => {
  try {
    const crews = await crewService.getAllCrews();
    res.status(200).json(crews);
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ message: "error" });
  }
};

const createCrew = async (req, res) => {
  try {
    const { userId, name, content, memberLimit, si, gu } = req.body;
    const crewImg = req.file ? `/uploads/${req.file.filename}` : null;

    const crewData = {
      userId,
      name,
      content,
      memberLimit,
      si,
      gu,
      crewImg,
      members: [userId],
      membercount: 1,
    };

    const crew = await crewService.createCrew(crewData);

    res.status(200).json({ message: "success", crew });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ message: "error" });
  }
};

const updateCrew = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, memberLimit, si, gu } = req.body;
    const crewImg = req.file ? `/uploads/${req.file.filename}` : undefined;

    const crewData = { content, memberLimit, si, gu, crewImg };

    const updatedCrew = await crewService.updateCrew(id, crewData);

    res.status(200).json(updatedCrew);
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ message: "error" });
  }
};

router.get("/", getCrews);
router.post("/", upload.single("crewImg"), createCrew);
router.put("/:id", upload.single("crewImg"), updateCrew);

module.exports = router;
