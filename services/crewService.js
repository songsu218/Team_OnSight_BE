const Feed = require('../models/Feed');
const Crew = require('../models/Crew');

async function userFeedList(userData) {
  try {
    const feedList = await Feed.find({ userId: { $in: userData } });
    if (!feedList) {
      return { message: 'no feeds List' };
    }

    return feedList;
  } catch (err) {
    return { message: 'feeds find mongoDB error' };
  }
}

const createCrew = async (crewData) => {
  try {
    const newCrew = new Crew(crewData);
    await newCrew.save();
    return newCrew;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
};

const getAllCrews = async () => {
  try {
    const crews = await Crew.find();
    return crews;
  } catch (error) {
    console.error('error', error);
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
    console.error('error', error);
    throw error;
  }
};

module.exports = {
  userFeedList,
  createCrew,
  getAllCrews,
  updateCrew,
};
