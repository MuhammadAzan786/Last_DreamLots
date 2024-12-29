const express = require("express");
const router = express.Router();
const bannerController = require("../controller/bannerController");


const multer = require("multer");
const path = require("path");
const fs = require("fs");
const verifyToken = require("../middleware/verifyTokenMiddleware");
const parentDir = path.dirname(__dirname);
const uploadDirProducts = path.join(parentDir, "uploads", "Banners");

if (!fs.existsSync(uploadDirProducts)) {
  fs.mkdirSync(uploadDirProducts, { recursive: true });
}

const storageProducts = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/Banners");
  },
  filename: function (req, file, cb) {
    const filename =
      Date.now() + "-" + req.uniqueIdentifier + "-" + file.originalname;
    cb(null, filename);
  },
});

// Unique Identifier Generator
const generateUniqueIdentifier = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

const upload = multer({
  storage: storageProducts,
}).fields([
  { name: "productImages", maxCount: 15 }, // Handle up to 15 product images
  { name: "thumbnail", maxCount: 1 }, // Handle a single thumbnail image
]);

router.post(
  "/addBanner",
  verifyToken,
  (req, res, next) => {
    const uniqueIdentifier = generateUniqueIdentifier();
    req.uniqueIdentifier = uniqueIdentifier;
    next();
  },
  upload,
  (err, req, res, next) => {
    if (err) {
      console.error("Error during file upload:", err);
      return res.status(500).send("Error uploading files");
    }
    next();
  },
  bannerController.addBanner
);

router.get("/getAllBanners", bannerController.getAllBanners);

router.delete(
  "/deleteBanner/:id",
  verifyToken,
  bannerController.deleteBanner
);

module.exports = router;