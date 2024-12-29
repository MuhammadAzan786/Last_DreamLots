const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  size: { type: Number, required: true },
  type: { type: String, required: true },
});

const formDataSchema = new mongoose.Schema({
  name: { type: String, required: true },
  propertyType: { type: String },
  area: { type: Number },
  bedrooms: { type: Number },
  bathrooms: { type: Number },
  price: { type: Number },
  city: { type: String },
  streetAddress: { type: String },
  location: {
    lat: {
      type: Number,
    },
    lng: {
      type: Number,
    },
  },
  thumbnail: { type: fileSchema },
  images: [fileSchema],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "authentication",
    required: true,
  },
});

const Properties = mongoose.model("Properties", formDataSchema);
module.exports = Properties;
