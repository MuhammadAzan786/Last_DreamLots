const cloudinary = require("../middleware/cloudinary");
const VirtualTourData = require("../model/virtualTourModel");

exports.addVirtualTour = async (req, res) => {
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
      hotspots,
    } = req.body;

    const locationString = req.body.location;
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
            { folder: "virtual_tour" },
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

    // Parse hotspots JSON
    const parsedHotspots = JSON.parse(hotspots);

    // Map hotspots to uploaded images
    const mappedHotspots = Object.entries(parsedHotspots).map(
      ([imageName, hs]) => {
        const imageUrl = imageUploads.find(
          (img) => img.name === imageName
        )?.url;
        if (!imageUrl) {
          throw new Error(`Image URL not found for: ${imageName}`);
        }
        return { imageUrl, hotspots: hs };
      }
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
      hotspots: mappedHotspots,
    };

    // Save to database
    const savedData = await VirtualTourData.create(formData);
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

exports.getAllVirtualTours = async (req, res) => {
  try {
    const allTours = VirtualTourData.find();
    res.status(200).json({ data: allTours });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({
      message: "Failed to fetch data",
      error: error.message || "Unknown error",
    });
  }
};

exports.getAllVirtualToursBySellerId = async (req, res) => {
  try {
    const property = await VirtualTourData.find({ seller: req.params.id });
    if (!property) {
      return res.status(404).json({ message: "Virtual Tour Data not found" });
    }
    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getVirtualTourById = async (req, res) => {
  try {
    const tourId = req.params.id;
    console.log(tourId);

    if (!tourId) {
      res.status(400).json({ error: "tour not found" });
    }
    const tour = await VirtualTourData.findById(tourId);
    if (!tour) {
      res.status(400).json({ error: "tour not found" });
    }
    res.status(200).json({ success: true, data: tour });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
