const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const UserSchema = new Schema({
  emailId: { type: String, required: true, unique: true },
  nick: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  thumbnail: { type: String },
  crews: { type: Array },
});

const UserModel = model('User', UserSchema);
module.exports = UserModel;
