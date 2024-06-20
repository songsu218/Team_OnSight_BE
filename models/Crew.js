const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const CrewSchema = new Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  si: { type: String, required: true },
  gu: { type: String, required: true },
  content: { type: String, required: true },
  crewImg: { type: String, default: "" },
  members: { type: [String], default: [] },
  memberLimit: { type: Number, required: true },
  membercount: { type: Number, default: 0 },
  feedcount: { type: Number, default: 0 },
});

const CrewModel = model("Crew", CrewSchema);

module.exports = CrewModel;
