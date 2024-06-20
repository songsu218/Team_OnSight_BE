const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const crewSchema = new Schema({
  userId: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  si,
  gu,
  content,
  crewImg,
  members,
  memberLimit,
  membercount,
  feedcount,

  id: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nick: { type: String, required: true },
  thumbnail: { type: String, default: "" },
  crews: { type: [String], default: [] },
});

const crewModel = model("Crew", crewSchema);
module.exports = crewModel;
