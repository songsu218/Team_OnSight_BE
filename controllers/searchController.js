const searchService = require('../services/searchService');

const getCenters = async (req, res) => {
  try {
    const centers = await searchService.getCenters();
    res.json(centers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getDistrictCoordinates = async (req, res) => {
  try {
    const coordinates = await searchService.getDistrictCoordinates();
    res.json(coordinates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getCenters,
  getDistrictCoordinates,
};
