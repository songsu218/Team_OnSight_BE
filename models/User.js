const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const UserSchema = new Schema({
  id: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nick: { type: String, required: true },
  thumbnail: { type: String, default: '' },
  crews: [{ type: Schema.Types.ObjectId, ref: 'Crew', default: [] }],
  events: [{ type: Schema.Types.ObjectId, ref: 'Challenge', default: [] }],
  like: [{ type: Schema.Types.ObjectId, ref: 'ClimbingCenter' }],
  recordcount: { type: Number, default: 0 },
  feedcount: { type: Number, default: 0 },
});

const UserModel = model('User', UserSchema);

module.exports = UserModel;
