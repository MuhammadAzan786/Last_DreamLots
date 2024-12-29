const express = require("express");
const router = express.Router();
const productController = require("../controller/productController");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const parentDir = path.dirname(__dirname);
const uploadDirProducts = path.join(parentDir, "uploads", "Products");

if (!fs.existsSync(uploadDirProducts)) {
  fs.mkdirSync(uploadDirProducts, { recursive: true });
}

const storageProducts = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/Products");
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
  "/addProduct",
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
  productController.createProduct
);

router.get("/getProducts", productController.getAllProducts);
router.get(
  "/getProductsWithoutfilter",
  productController.getProductsWithoutfilter
);

router.get("/product/:id", productController.getProducts);
router.get("/uniqueproduct/:id", productController.getUniqueProducts);

router.delete("/delet/:id", productController.deleteProduct);
router.post("/productsByIds", productController.getProductsByIds); // POST request to requires a list of id's return the product on the basis of list of id's
router.patch("/editstock/:id", productController.editstock);
router.put(
  "/editproduct/:id",
  (req, res, next) => {
    const uniqueIdentifier = generateUniqueIdentifier();
    req.uniqueIdentifier = uniqueIdentifier;
    console.log("Unique Identifier attached to request:", req.uniqueIdentifier);
    next();
  },
  upload,
  (err, req, res, next) => {
    if (err) {
      0;
      console.error("Error during file upload:", err);
      return res.status(500).send("Error uploading files");
    }
    next();
  },
  productController.editProduct
);

module.exports = router;
