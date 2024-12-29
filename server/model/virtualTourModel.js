const mongoose = require("mongoose");

const hotspotSchema = new mongoose.Schema({
  pitch: { type: Number, required: true },
  yaw: { type: Number, required: true },
  roomId: { type: String, required: true },
  description: { type: String, required: true },
  targetImage: { type: String, required: true },
});

const imageHotspotsSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  hotspots: [hotspotSchema],
});

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
  hotspots: [
    {
      type: imageHotspotsSchema,
      required: true,
    },
  ],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "authentication",
    required: true,
  },
});

const VirtualTourData = mongoose.model("VirtualTourData", formDataSchema);
module.exports = VirtualTourData;
