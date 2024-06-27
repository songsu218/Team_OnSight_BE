const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const DistrictCoordinatesSchema = new Schema({
  gu: { type: String, required: true },
  latlng: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
});

const DistrictCoordinatesModel = model(
  'DistrictCoordinates',
  DistrictCoordinatesSchema
);

module.exports = DistrictCoordinatesModel;
