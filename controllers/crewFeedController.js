const express = require("express");
const multer = require("multer");
const crewFeedService = require("../services/crewFeedService");

const router = express.Router();
const upload = multer();

const createCrewFeed = async (req, res) => {
  try {
    const { title, content, userId, crewId, crewName } = req.body;
    const feedData = { crewName, title, content, userId, crewId };
    const newFeed = await crewFeedService.createCrewFeed(feedData);
    res.status(201).json(newFeed);
  } catch (error) {
    res.status(500).json({ message: "error", error });
  }
};

const getCrewFeed = async (req, res) => {
  try {
    const { id } = req.params;
    const feed = await crewFeedService.getCrewFeed(id);
    if (feed.message) {
      res.status(404).json(feed);
    } else {
      res.status(200).json(feed);
    }
  } catch (error) {
    res.status(500).json({ message: "error", error });
  }
};

const updateCrewFeed = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, userId, crewId } = req.body;
    const feedData = { title, content, userId, crewId };
    const updatedFeed = await crewFeedService.updateCrewFeed(id, feedData);
    if (updatedFeed.message) {
      res.status(404).json(updatedFeed);
    } else {
      res.status(200).json(updatedFeed);
    }
  } catch (error) {
    res.status(500).json({ message: "error", error });
  }
};

const deleteCrewFeed = async (req, res) => {
  try {
    const { id } = req.params;
    const feed = await crewFeedService.getCrewFeed(id);
    if (feed.message) {
      res.status(404).json(feed);
      return;
    }

    const deletedFeed = await crewFeedService.deleteCrewFeed(id);
    if (deletedFeed.message) {
      res.status(404).json(deletedFeed);
    } else {
      res.status(200).json({ message: "success", crewId: feed.crewId });
    }
  } catch (error) {
    res.status(500).json({ message: "error", error });
  }
};

const getSpecificCrewFeed = async (req, res) => {
  try {
    const { crewId } = req.params;
    const feeds = await crewFeedService.getSpecificCrewFeed(crewId);
    res.status(200).json(feeds);
  } catch (error) {
    res.status(500).json({ message: "error", error });
  }
};

const getSpecificCrewFeedDetail = async (req, res) => {
  try {
    const { feedId } = req.params;
    const feed = await crewFeedService.getSpecificCrewFeedDetail(feedId);
    if (!feed) {
      res.status(404).json({ message: "deleted feed" });
    } else {
      res.status(200).json(feed);
    }
  } catch (error) {
    res.status(500).json({ message: "error", error });
  }
};

router.post("/viewIncrement/:feedId", async (req, res) => {
  try {
    const { feedId } = req.params;
    await crewFeedService.incrementViewCount(feedId);
    res.status(200).json({ message: "조회수 증가 성공" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", upload.none(), createCrewFeed);
router.get("/:id", getCrewFeed);
router.put("/:id", upload.none(), updateCrewFeed);
router.delete("/:id", deleteCrewFeed);
router.get("/crew/:crewId", getSpecificCrewFeed);
router.get("/detail/:feedId", getSpecificCrewFeedDetail);

module.exports = router;
