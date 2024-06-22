const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const RecordSchema = new Schema({
  userId: { type: String, required: true },
  nick: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  center: { type: String, required: true },
  thumbnail: { type: String, required: true },
  level: { type: Map, of: Number, required: true },
  levelsum: { type: Number, required: true },
  date: { type: Date, required: true },
});

const Record = model('Record', RecordSchema);

module.exports = Record;
