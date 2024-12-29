const multer = require("multer");

// Configure multer with memory storage
const storage = multer.memoryStorage();

const upload = multer({
  storage, // Use memory storage
  limits: {
    fileSize: 50 * 1024 * 1024, // Limit files to 50 MB each
  },
  fileFilter: (req, file, cb) => {
    // Validate file type
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true); // Accept the file
    } else {
      cb(
        new Error("Invalid file type. Only JPEG, PNG, and GIF are allowed."),
        false
      ); // Reject the file
    }
  },
}).fields([
  { name: "images", maxCount: 15 },
  { name: "thumbnail", maxCount: 1 }, // Handle a single thumbnail image
]);

module.exports = upload;
