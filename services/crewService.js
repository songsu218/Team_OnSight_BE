const Feed = require("../models/Feed");
const Crew = require("../models/Crew");
const User = require("../models/User");

async function userFeedList(userData) {
  try {
    const feedList = await Feed.find({ userId: { $in: userData } });
    if (!feedList) {
      return { message: "no feeds List" };
    }

    return feedList;
  } catch (err) {
    return { message: "feeds find mongoDB error" };
  }
}

const createCrew = async (crewData) => {
  try {
    const newCrew = new Crew(crewData);
    await newCrew.save();
    if (!newCrew) {
      console.error(`crew create faild ${crewData}`);
      throw new Error("크루생성 실패");
    }
    console.log("crew create success : ", newCrew);

    const userUPdate = await User.findOneAndUpdate(
      { id: crewData.userId },
      { $push: { crews: newCrew._id } },
      { new: true, runValidators: true }
    );

    if (!userUPdate) {
      console.error("User not found with userId : ", crewData.userId);
      throw new Error("사용자를 찾을 수 없습니다.");
    }

    console.log("user crews update success : ", crewData.userId);
    return newCrew;
  } catch (err) {
    console.error("error", err);
    throw err;
  }
};

const getAllCrews = async () => {
  try {
    const crews = await Crew.find();
    return crews;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
};

const updateCrew = async (id, crewData) => {
  try {
    const updateData = { ...crewData };
    if (!crewData.crewImg) {
      delete updateData.crewImg;
    }

    const updatedCrew = await Crew.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    return updatedCrew;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
};

module.exports = {
  userFeedList,
  createCrew,
  getAllCrews,
  updateCrew,
};
