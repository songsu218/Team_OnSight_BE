const express = require("express");
const userService = require("../services/crewService");
const cookieParser = require("cookie-parser");

const router = express.Router();

router.use(cookieParser());

//crew post (Routes)
app.post("/createCrew", async (req, res) => {
  const {
    id,
    name,
    si,
    gu,
    content,
    crewImg,
    members,
    memberLimit,
    membercount,
    feedcount,
  } = req.body;
  const newCrew = new Crew({
    id,
    name,
    si,
    gu,
    content,
    crewImg,
    members,
    memberLimit,
    membercount,
    feedcount,
  });
  try {
    const savedCrew = await newCrew.save();
    res.status(201).json(savedCrew);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
