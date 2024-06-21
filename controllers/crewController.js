const Crew = require("../models/Crew");
const User = require("../models/User");

const createCrew = async (req, res) => {
  try {
    const { userId, name, si, gu, content, memberLimit } = req.body;
    let crewImg = "";
    if (req.file) {
      crewImg = req.file.path; // Assuming you use a middleware like multer for file uploads
    }

    // 새로운 크루 생성
    const newCrew = new Crew({
      userId,
      name,
      si,
      gu,
      content,
      crewImg,
      memberLimit,
      members: [userId], // 크루 생성 시 크루장 포함
      membercount: 1,
      feedcount: 0,
    });

    // 크루 저장
    await newCrew.save();

    // 해당 유저의 crews 배열에 새로운 크루의 이름 추가
    await User.findByIdAndUpdate(userId, { $push: { crews: newCrew.name } });

    res.status(201).json({ message: "Crew created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating crew", error });
  }
};

module.exports = {
  createCrew,
};
