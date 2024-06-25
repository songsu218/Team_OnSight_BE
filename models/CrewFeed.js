const mongoose = require('mongoose');

const CrewFeedSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  userId: { type: String, required: true },
  crewId: { type: String, required: true },
  createdTime: { type: Date, default: Date.now },
  updatedTime: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CrewFeed', CrewFeedSchema);
