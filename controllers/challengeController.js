const express = require("express");
const challengeService = require("../services/challengeService");
const userService = require("../services/userService");
const cookieParser = require("cookie-parser");

const router = express.Router();

router.use(cookieParser());

//challenge 등록
router.post("/register", async (req, res) => {
  // const { challengename,id,name,center,address,date,members } = req.body;

  try {
    const newChallenge = await challengeService.register(req.body);
    const userUpdate = await userService.challCreate(newChallenge);
    if (!userUpdate) {
      console.log("첼린지 사용자 정보 업데이트 실패");
    }
    res.json(newChallenge);
  } catch (err) {
    res.json({ message: err.message });
  }
});

//challenge 참가신청
router.post("/challegeEnter", async (req, res) => {
  // const { challengename,members } = req.body;

  try {
    const pushChallenge = await challengeService.challegeEnter(req.body);
    const userUpdate = await userService.challJoin(
      req.body,
      pushChallenge.ChallengeDoc
    );
    if (!userUpdate) {
      console.log("첼린지 사용자 정보 업데이트 실패");
    }
    res.json(pushChallenge);
  } catch (err) {
    res.json({ message: err.message });
  }
});

//challengeMyList 챌린지 나의 리스트
router.post("/challengeMyList", async (req, res) => {
  // const { TAG('TOT','NOW','PAST'), member_id } = req.body;

  try {
    const challengeMyList = await challengeService.challengeMyList(req.body);
    res.json(challengeMyList);
  } catch (err) {
    res.json({ message: err.message });
  }
});

//challengeTotList 챌린지 전체리스트
router.post("/challengeTotList", async (req, res) => {
  // const { TAG('TOT','NOW','PAST') } = req.body;

  try {
    const challengeTotList = await challengeService.challengeTotList(req.body);
    res.json(challengeTotList);
  } catch (err) {
    res.json({ message: err.message });
  }
});

//challengeNowDetail 챌린지 현재 전체 목록
router.post("/challengeMemberList", async (req, res) => {
  // const { challengename } = req.body;

  try {
    const challengeMemberList = await challengeService.challengeMemberList(
      req.body
    );
    res.json(challengeMemberList);
  } catch (err) {
    res.json({ message: err.message });
  }
});

//challengeInfo 상세페이지 상단 챌린지 정보
router.post("/challengeInfo", async (req, res) => {
  // const { challengename } = req.body;

  try {
    const challengeInfo = await challengeService.challengeInfo(req.body);
    res.json(challengeInfo);
  } catch (err) {
    res.json({ message: err.message });
  }
});

//챌린지별 랭킹 목록
router.post("/challengeRanking", async (req, res) => {
  // const { challengename } = req.body;
  try {
    const challengeRanking = await challengeService.challengeRanking(req.body);
    res.json(challengeRanking);
  } catch (err) {
    res.json({ message: err.message });
  }
});

//challengeLevel 챌리지레벨
router.post("/challengeLevel", async (req, res) => {
  // const { center,member_id } = req.body;

  try {
    const challengeLevelList = await challengeService.challengeLevel(req.body);
    res.json(challengeLevelList);
  } catch (err) {
    res.json({ message: err.message });
  }
});

module.exports = router;
