const CrewFeed = require("../models/CrewFeed");
const User = require("../models/User");

const createCrewFeed = async (feedData) => {
  try {
    const newFeed = await CrewFeed.create(feedData);

    const user = await User.findOneAndUpdate(
      { id: feedData.userId },
      { $inc: { feedcount: 1 } },
      { new: true }
    );

    if (!user) {
      return { status: 404, message: "사용자를 찾을 수 없습니다." };
    }

    return {
      status: 201,
      message: "피드가 성공적으로 생성되었습니다.",
      newFeed,
    };
  } catch (err) {
    console.error("피드 생성 중 오류 발생:", err);
    if (err.name === "ValidationError") {
      return { status: 400, message: err.message };
    }
    return {
      status: 500,
      message: "서버 오류가 발생했습니다. 다시 시도해 주세요.",
    };
  }
};

const getCrewFeed = async (id) => {
  try {
    const feed = await CrewFeed.findById(id);
    if (!feed) {
      return { message: "deleted feed" };
    }
    return feed;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
};

const updateCrewFeed = async (id, feedData) => {
  try {
    const updatedFeed = await CrewFeed.findByIdAndUpdate(id, feedData, {
      new: true,
    });
    if (!updatedFeed) {
      return { message: "deleted feed" };
    }
    return updatedFeed;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
};

const deleteCrewFeed = async (feedId, userId) => {
  try {
    const deletedFeed = await CrewFeed.findByIdAndDelete({
      _id: feedId,
      userId: userId,
    });
    if (!deletedFeed) {
      return { status: 404, message: "삭제된 피드입니다." };
    }
    const user = await User.findOneAndUpdate(
      { id: userId },
      { $inc: { feedcount: -1 } },
      { new: true }
    );

    if (!user) {
      return { status: 404, message: "사용자를 찾을 수 없습니다." };
    }

    return { status: 200, message: "피드가 성공적으로 삭제되었습니다." };
  } catch (error) {
    console.error("피드 삭제 중 오류 발생:", error);
    return {
      status: 500,
      message: "서버 오류가 발생했습니다. 다시 시도해 주세요.",
    };
  }
};

const getSpecificCrewFeed = async (crewId) => {
  try {
    const feeds = await CrewFeed.find({ crewId });
    return feeds;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
};

const getSpecificCrewFeedDetail = async (feedId) => {
  try {
    const feed = await CrewFeed.findById(feedId);
    if (!feed) {
      return { message: "deleted feed" };
    }

    const user = await User.findOne({ id: feed.userId });
    if (!user) {
      return { message: "deleted user" };
    }

    return {
      ...feed.toObject(),
      nick: user.nick,
    };
  } catch (error) {
    console.error("error", error);
    throw error;
  }
};

const incrementViewCount = async (feedId) => {
  try {
    await CrewFeed.findByIdAndUpdate(feedId, { $inc: { views: 1 } });
  } catch (error) {
    throw new Error("조회수 증가 실패");
  }
};

module.exports = {
  createCrewFeed,
  getCrewFeed,
  updateCrewFeed,
  deleteCrewFeed,
  getSpecificCrewFeed,
  getSpecificCrewFeedDetail,
  incrementViewCount,
};
