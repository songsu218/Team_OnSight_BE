const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const ChallengeSchema = new Schema({
  challengename: { type: String, required: true, unique: true },
  id: { type: String, required: true },
  name: { type: String, default: '' },
  center: { type: String, default: '' },
  address: { type: String, default: '' },
  date: { type: [String], default: [] },
  members: { type: [String], default: [] },
});

const ChallengeModel = model('Challenge', ChallengeSchema);

module.exports = ChallengeModel;
