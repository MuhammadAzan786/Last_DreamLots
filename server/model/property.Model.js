const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    seller:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "authentication",
        required:true,
    },
    propertyName: {
        type: String,
        // required: true,
      },
    propertyType: {
        type: String,
        // required: true,
    },
    propertyCategory: {
        type: String,
        // required: true,
    },
    propertyPrice: {
        type: Number,
        // required: true,
    },
    floors: {
        type: Number,
        default: 0,
    },
    bedrooms: {
        type: Number,
        default: 0,
    },
    bathrooms: {
        type: Number,
        default: 0,
    },
    address: {
        type: String,
        // required: true,
    },
    city: {
        type: String,
        // required: true,
    },
    propertySize: {
        type: String,
        // required: true,
    },
    description: {
        type: String,
        // required: true,
    },
    lat: {
        type: String,
        // required: true,
    },
    lng: {
        type: String,
        // required: true,
    },
    gasSupply: {
        type: Boolean,
        default: false,
    },
    waterSupply: {
        type: Boolean,
        default: false,
    },
    electricity: {
        type: Boolean,
        default: false,
    },
    solarEnergy: {
        type: Boolean,
        default: false,
    },
    securityStaff: {
        type: Boolean,
        default: false,
    },
    swimmingPool: {
        type: Boolean,
        default: false,
    },
    garage: {
        type: Boolean,
        default: false,
    },
    thumbnail: {
        type: String,
        default: null,
    },
    images: {
        type: [String],
        default: [],
    },
    wishlist:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'User', 
        }
    ],
    comments:[{
        text:{
            type:String,
            // required:true
        },
        user:{
            type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        // required:true
        }
    }]
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;
