const Property = require("../model/property.Model");

const cloudinary = require("../middleware/cloudinary");

// Add a new property
const addProperty = async (req, res) => {
  try {
    // Extract name and hotspots
    const {
      name,
      propertyType,
      area,
      bedrooms,
      bathrooms,
      price,
      city,
      seller,
      streetAddress,
    } = req.body;
    console.log("name", name);
    console.log("request body", req.body);
    const locationString = req.body.location;
    console.log("locationString", locationString);
    const locationData = JSON.parse(locationString);
    console.log("locationData.lat", locationData.lat);
    const { images, thumbnail } = req.files;
    if (!images || images.length === 0) {
      return res.status(400).json({ message: "No product images uploaded" });
    }
    if (!thumbnail || thumbnail.length === 0) {
      return res.status(400).json({ message: "No thumbnail uploaded" });
    }
    // Upload the thumbnail to Cloudinary
    const thumbnailUpload = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "thumbnails" },
        (error, result) => {
          if (error) return reject(error);
          resolve({
            name: thumbnail[0].originalname,
            url: result.secure_url,
            size: thumbnail[0].size,
            type: thumbnail[0].mimetype,
          });
        }
      );
      uploadStream.end(thumbnail[0].buffer);
    });
    console.log("thumbnailUpload", thumbnailUpload);
    // Upload files to Cloudinary
    const imageUploads = await Promise.all(
      images.map((file) => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "property" },
            (error, result) => {
              if (error) return reject(error);
              resolve({
                name: file.originalname,
                url: result.secure_url,
                size: file.size,
                type: file.mimetype,
              });
            }
          );
          uploadStream.end(file.buffer);
        });
      })
    );

    // Form data to save
    const formData = {
      name,
      propertyType,
      area,
      bedrooms,
      bathrooms,
      price,
      city,
      seller,
      streetAddress,
      location: {
        lat: locationData.lat,
        lng: locationData.lng,
      },
      thumbnail: thumbnailUpload,
      images: imageUploads,
    };

    // Save to database
    const savedData = await Property.create(formData);
    res
      .status(200)
      .json({ message: "Data saved successfully!", data: savedData });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({
      message: "Failed to save data",
      error: error.message || "Unknown error",
    });
  }
};

// Get a single property by its ID
const getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.status(200).json(property);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all properties
const getAllProperty = async (req, res) => {
  try {
    const properties = await Property.find().populate("user", "name");
    res.status(200).json(properties);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all properties for a specific user
const getAllPropertyOfUser = async (req, res) => {
  try {
    const properties = await Property.find({ user: req.user._id }).populate(
      "user",
      "name"
    );
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
      return res.status(404).json({ message: "Property not found" });
    }
    res.status(200).json({
      message: "Property updated successfully",
      property: updatedProperty,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a property by its ID
const deleteProperty = async (req, res) => {
  try {
    const deletedProperty = await Property.findByIdAndDelete(req.params.id);
    if (!deletedProperty) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Like a property
const likeProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Check if user has already liked this property
    if (property.wishlist.includes(req.user._id)) {
      return res
        .status(400)
        .json({ message: "You already added in wishlist this property" });
    }

    property.wishlist.push(req.user._id);
    await property.save();

    res.status(200).json({
      message: "Property added to wishlist successfully",
      likes: property.likes.length,
    });
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
  likeProperty,
};
