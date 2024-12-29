const Banner = require("../model/bannerModel");
const asyncHandler = require("../utils/AsyncHandler");
const { uploadOnCloudinary, deleteImage } = require("../utils/cloudinary");


module.exports = {
  addBanner: asyncHandler(async (req, res) => {
 
  
    const files = req.files; // Correctly access files
   
    const filesLength = files ? files.length : 0;

    console.log(files);
    console.log(req.uniqueIdentifier);

 


    try {
      // Create an array to store file details
      const fileDetails = await Promise.all(
        files.productImages.map(async (file) => {
          const ImageUrl = await uploadOnCloudinary(file.path);
          return {
            public_id: ImageUrl.public_id,
            created_at: ImageUrl.created_at,
            bytes: ImageUrl.bytes,
            url: ImageUrl.secure_url,
            format: ImageUrl.format,
            original_filename: ImageUrl.original_filename
          };
        })
      );
     // Create a new banner with uploaded images and category
     const newBanner = new Banner({
     
      bannerImages: fileDetails,   // Store the uploaded images details
    });

    // Save the banner to the database
    await newBanner.save();

    console.log("Banner saved successfully");
    res.status(200).send("Banner uploaded and saved successfully");
      

      console.log("Request coming here");
      
    

    } catch (error) {
      if (error.code === 11000) {
        // MongoDB duplicate key error code
        res.status(400).send("Duplicate ID detected. The ID must be unique.");
      } else {
        res.status(500).send("An unexpected error occurred adding Product.");
      }
    }
  }),

  getAllBanners: asyncHandler(async (req, res) => {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: banners });
  }),

  deleteBanner: asyncHandler(async (req, res) => {
    const bannerId = req.params.id;

    const banner = await Banner.findById(bannerId);
    if (!banner) {
      return res.status(404).json({ error: "Banner not found" });
    }

    await Promise.all(
      banner.bannerImages.map(async (image) => {
        try {
          await deleteImage(image.public_id);
        } catch (err) {
          console.error(`Failed to delete banner image ${image.public_id}:`, err);
        }
      })
    );

    await Banner.findByIdAndDelete(bannerId);

    res.status(200).json({ message: "Banner and associated images deleted successfully" });
  }),
};