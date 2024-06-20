const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const RecordSchema = new Schema({
  title: { type: String, required: true },
  detail: { type: String, required: true },
  center: { type: String, required: true },
  date: { type: Date, required: true },
  level: { type: Map, of: Number, required: true },
  levelsum: { type: Number, required: true },
  thumbnail: { type: String },
});

const Record = model('Record', RecordSchema);

module.exports = Record;
