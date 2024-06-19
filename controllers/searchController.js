//암장 즐겨찾기 추가
// 시 구 DB 가져오기
//암장 리스트 검색

//암장 리스트 가져오기
const ClimbingCenter = require('../models/climbingCenter');

exports.getCenters = async (req, res) => {
  try {
    const centers = await ClimbingCenter.find();
    res.json(centers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
