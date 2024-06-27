const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const climbingCenterSchema = new Schema({
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
    type: Map,
    of: String,
    required: true,
  },
});

const climbingCenterModel = model('ClimbingCenter', climbingCenterSchema, 'center');
module.exports = climbingCenterModel;
