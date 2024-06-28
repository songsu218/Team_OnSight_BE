const express = require("express");
const router = express.Router();
const centerService = require("../services/centerService");
const postService = require("../services/postService");

router.post("/centerList", async (req, res) => {
  try {
    const centerList = await centerService.selectCenter();
    res.json(centerList);
  } catch (err) {
    res.json({ message: err.message });
  }
});

router.post("/guList", async (req, res) => {
  try {
    const guList = await centerService.selectGu();
    res.json(guList);
  } catch (err) {
    res.json({ message: err.message });
  }
});

router.get("/:centerId", async (req, res) => {
  const centerId = req.params.centerId;
  try {
    console.log("센터리코드 컨트롤 실행");
    const records = await postService.postList(centerId);
    res.json(records);
  } catch (err) {
    console.log("에러로 빠짐");
    res.json({ message: err.message });
  }
});

router.get("/center/:centerId");

module.exports = router;
