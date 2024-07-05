const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const ChallengeSchema = new Schema({
  challengename: { type: String, required: true, unique: true },
  id: { type: String, required: true },
  center: { type: String, default: '' },
  address: { type: String, default: '' },
  thumbnail: { type: String, default: '' },
  members: { type: [String], default: [] },
  date: { type: [Date], default: [] },
  state: { type: Boolean, default: false },
});

const ChallengeModel = model('Challenge', ChallengeSchema);

module.exports = ChallengeModel;
