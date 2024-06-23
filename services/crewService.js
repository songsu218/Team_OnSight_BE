const Feed = require("../models/Feed");

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

module.exports = {
  userFeedList,
};
