const CrewFeed = require('../models/CrewFeed');
const User = require('../models/User');

const createCrewFeed = async (feedData) => {
  try {
    const newFeed = new CrewFeed(feedData);
    await newFeed.save();
    return newFeed;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
};

const getCrewFeed = async (id) => {
  try {
    const feed = await CrewFeed.findById(id);
    if (!feed) {
      return { message: 'deleted feed' };
    }
    return feed;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
};

const updateCrewFeed = async (id, feedData) => {
  try {
    const updatedFeed = await CrewFeed.findByIdAndUpdate(id, feedData, {
      new: true,
    });
    if (!updatedFeed) {
      return { message: 'deleted feed' };
    }
    return updatedFeed;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
};

const deleteCrewFeed = async (id) => {
  try {
    const deletedFeed = await CrewFeed.findByIdAndDelete(id);
    if (!deletedFeed) {
      return { message: 'deleted feed' };
    }
    return { message: 'success' };
  } catch (error) {
    console.error('error', error);
    throw error;
  }
};

const getSpecificCrewFeed = async (crewId) => {
  try {
    const feeds = await CrewFeed.find({ crewId });
    return feeds;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
};

const getSpecificCrewFeedDetail = async (feedId) => {
  try {
    const feed = await CrewFeed.findById(feedId);
    if (!feed) {
      return { message: 'deleted feed' };
    }

    const user = await User.findOne({ id: feed.userId });
    if (!user) {
      return { message: 'deleted user' };
    }

    return {
      ...feed.toObject(),
      nick: user.nick,
    };
  } catch (error) {
    console.error('error', error);
    throw error;
  }
};

module.exports = {
  createCrewFeed,
  getCrewFeed,
  updateCrewFeed,
  deleteCrewFeed,
  getSpecificCrewFeed,
  getSpecificCrewFeedDetail,
};
