const Center = require("../models/Center");
const Gu = require("../models/DistrictCoordinates");

async function selectCenter() {
  try {
    const centerDoc = await Center.find({});
    if (!centerDoc) {
      return { message: "nocenter" };
    }
    return centerDoc;
  } catch (err) {
    return { message: "center find mongoDB error" };
  }
}

async function selectGu() {
  try {
    const centerDoc = await Gu.find({});
    if (!centerDoc) {
      return { message: "nocenter" };
    }
    return centerDoc;
  } catch (err) {
    return { message: "center find mongoDB error" };
  }
}

module.exports = {
  selectCenter,
  selectGu,
};
