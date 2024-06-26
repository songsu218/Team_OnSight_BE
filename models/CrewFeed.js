const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const CrewFeedSchema = new Schema({
  crewName: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  userId: { type: String, required: true },
  crewId: { type: String, required: true },
  views: { type: Number, default: 0 },
  createdTime: { type: Date, default: Date.now },
  updatedTime: { type: Date, default: Date.now },
});

const CrewFeedModel = model("CrewFeed", CrewFeedSchema);

module.exports = CrewFeedModel;
