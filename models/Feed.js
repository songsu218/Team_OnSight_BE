const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const FeedSchema = new Schema({
  userId: { type: String, required: true },
  userNick: { type: String, required: true },
  crewName: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  thumbnail: { type: String, default: "" },
  images: { type: [String], default: [] },
  views: { type: Number, default: 0 },
  date: { type: Date, required: true },
});

const FeedModel = model("Feed", FeedSchema);

module.exports = FeedModel;
