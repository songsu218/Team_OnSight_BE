const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const UserSchema = new Schema({
  id: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nick: { type: String, required: true },
  thumbnail: { type: String, default: '' },
  crews: { type: [String], default: [] },
  events: { type: [String], default: [] },
  like: { type: [String], default: [] },
  recordcount: { type: Number, default: 0 },
  feedcount: { type: Number, default: 0 },
});

const UserModel = model('User', UserSchema);

module.exports = UserModel;
