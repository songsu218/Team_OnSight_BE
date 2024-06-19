const mongoose = require('mongoose');

const climbingCenterSchema = new mongoose.Schema({
  center: { type: String, required: true },
  si: { type: String, required: true },
  gu: { type: String, required: true },
  address: { type: String, required: true },
  latlng: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  contact: { type: String, required: true },
  detail: { type: String, required: true },
  website: { type: String, required: true },
  thumbnail: { type: String, required: true },
  level: {
    1: { type: String, required: true },
    2: { type: String, required: true },
  },
});

module.exports = mongoose.model(
  'ClimbingCenter',
  climbingCenterSchema,
  'center'
);
