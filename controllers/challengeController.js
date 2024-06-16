const express = require('express');
const challengeService = require('../services/challengeService');
const cookieParser = require('cookie-parser');

const router = express.Router();

router.use(cookieParser());

//challenge 등록
router.post('/register', async (req, res) => {
  // const { challengename,id,name,center,address,date,members } = req.body;

  try {
    const newChallenge = await challengeService.register(req.body);
    res.json(newChallenge);
  } catch (err) {
    res.json({ message: err.message });
  }
});

//challenge 참가신청
router.post('/challegeEnter', async (req, res) => {
  // const { challengename,members } = req.body;

  try {
    const pushChallenge = await challengeService.challegeEnter(req.body);
    res.json(pushChallenge);
  } catch (err) {
    res.json({ message: err.message });
  }
});

//challengeNowMyList 챌린지 현재 전체 목록
router.post('/challengeNowList', async (req, res) => {
  // const { date,member_id } = req.body;

  try {
    const ChallengeNowList = await challengeService.challengeNowList(req.body);
    res.json(ChallengeNowList);
  } catch (err) {
    res.json({ message: err.message });
  }
});

//challengePastList 챌린지 현재 전체 목록
router.post('/challengePastList', async (req, res) => {
  // const { date,member_id } = req.body;

  try {
    const challengePastList = await challengeService.challengePastList(req.body);
    res.json(challengePastList);
  } catch (err) {
    res.json({ message: err.message });
  }
});

//challengeNowDetail 챌린지 현재 전체 목록
router.post('/challengeNowDetail', async (req, res) => {
  // const { challengename } = req.body;

  try {
    const challengeNowDetailList = await challengeService.challengeNowDetail(req.body);
    res.json(challengeNowDetailList);
  } catch (err) {
    res.json({ message: err.message });
  }
});

//challengePastDetail 챌린지 현재 전체 목록
router.post('/challengePastDetail', async (req, res) => {
  // const { challengename } = req.body;
  try {
    const challengePastDetailList = await challengeService.challengePastDetail(req.body);
    res.json(cchallengePastDetailList);
  } catch (err) {
    res.json({ message: err.message });
  }
});

//challengeLevel 챌리지레벨
router.post('/challengeLevel', async (req, res) => {
  // const { center,member_id } = req.body;

  try {
    const challengeLevelList = await challengeService.challengeLevel(req.body);
    res.json(challengeLevelList);
  } catch (err) {
    res.json({ message: err.message });
  }
});


module.exports = router;
