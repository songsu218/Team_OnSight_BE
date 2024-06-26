const ClimbingCenter = require('../models/climbingCenter');
const DistrictCoordinates = require('../models/DistrictCoordinates');

const getCenters = async () => {
  try {
    const centers = await ClimbingCenter.find();
    return centers;
  } catch (err) {
    throw new Error(err.message);
  }
};

const getDistrictCoordinates = async () => {
  try {
    const coordinates = await DistrictCoordinates.find();
    return coordinates;
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = {
  getCenters,
  getDistrictCoordinates,
};
