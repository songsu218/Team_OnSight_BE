const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const UserSchema = new Schema({
  id: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nick: { type: String, required: true },
  thumbnail: { type: String, default: '' },
  crews: { type: [String], default: [] },
});

const UserModel = model('User', UserSchema);

module.exports = UserModel;
