const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bannerSchema = new Schema({
  bannerImages: [
    {
      public_id: {
        type: String,
        required: true
      },
    
      bytes: {
        type: Number,
        required: true
      },
      url: {
        type: String,
        required: true
      },
      format: {
        type: String,
        required: true
      },
      original_filename: {
        type: String,
        required: true
      }
    }
  ],
  // ... other fields you need for banners
},{ timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);