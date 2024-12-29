const Property = require('../model/property.Model');
const User = require('../model/authenticationModel');
const cloudinary = require("../middleware/cloudinary");

// Add a new property
const addProperty = async (req, res) => {
    try {
        const { seller, propertyName, propertyType, propertyCategory, propertyPrice, city, propertySize, description, lat, lng, gasSupply, waterSupply, electricity, solarEnergy, securityStaff, swimmingPool, garage } = req.body;
        const { thumbnail, images } = req.body; // assuming you're using `req.files` to capture file uploads

        // Upload the thumbnail image to Cloudinary
        const thumbnailResult = await cloudinary.uploader.upload(thumbnail[0].path);

        // Upload the images array to Cloudinary
        const imageResults = await Promise.all(
            images.map(async (image) => {
                const result = await cloudinary.uploader.upload(image.path);
                return result.secure_url;
            })
        );

        // Create a new property document
        const newProperty = new Property({
            seller, // assuming `req.user` is set by authentication middleware
            propertyName,
            propertyType,
            propertyCategory,
            propertyPrice,
            city,
            propertySize,
            description,
            lat,
            lng,
            gasSupply,
            waterSupply,
            electricity,
            solarEnergy,
            securityStaff,
            swimmingPool,
            garage,
            thumbnail: thumbnailResult.secure_url, // Store the Cloudinary URL
            images: imageResults, // Store the Cloudinary URLs for the images
        });

        // Save property to database
        await newProperty.save();
        res.status(201).json({ message: 'Property added successfully', property: newProperty });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get a single property by its ID
const getProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }
        res.status(200).json(property);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all properties
const getAllProperty = async (req, res) => {
    try {
        const properties = await Property.find().populate('user', 'name');
        res.status(200).json(properties);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all properties for a specific user
const getAllPropertyOfUser = async (req, res) => {
    try {
        const properties = await Property.find({ user: req.user._id }).populate('user', 'name');
        res.status(200).json(properties);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a property by its ID
const updateProperty = async (req, res) => {
    try {
        const updatedProperty = await Property.findByIdAndUpdate(
            req.params.id,
            { ...req.body },
            { new: true }
        );
        if (!updatedProperty) {
            return res.status(404).json({ message: 'Property not found' });
        }
        res.status(200).json({ message: 'Property updated successfully', property: updatedProperty });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a property by its ID
const deleteProperty = async (req, res) => {
    try {
        const deletedProperty = await Property.findByIdAndDelete(req.params.id);
        if (!deletedProperty) {
            return res.status(404).json({ message: 'Property not found' });
        }
        res.status(200).json({ message: 'Property deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Like a property
const likeProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Check if user has already liked this property
        if (property.wishlist.includes(req.user._id)) {
            return res.status(400).json({ message: 'You already added in wishlist this property' });
        }

        property.wishlist.push(req.user._id);
        await property.save();

        res.status(200).json({ message: 'Property added to wishlist successfully', likes: property.likes.length });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    addProperty,
    getProperty,
    getAllProperty,
    getAllPropertyOfUser,
    updateProperty,
    deleteProperty,
    likeProperty
};
