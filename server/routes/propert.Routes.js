const express = require("express");
const router = express.Router();
const {
  addProperty,
  getProperty,
  getAllProperty,
  getAllPropertyOfUser,
  updateProperty,
  deleteProperty,
  likeProperty,
} = require("../controller/property.Controller");
const multerUploader = require("../middleware/VirtualTourMulterConfig");

// Route to add a new property => protect
router.post(
  "/add-property",
  multerUploader,
  //   async (req, res, next) => {
  //     console.log("Request Body:", req.body); // Should now contain text fields
  //     console.log("Request Files:", req.files);
  //     next();
  //   },
  addProperty
);

// Route to get a single property by its ID
router.get("/get-property-by/:id", getProperty);

// Route to get all properties
router.get("/get-all-property", getAllProperty);

// Route to get all properties of the current logged-in user => proptect
router.get("/get-property-user/user", getAllPropertyOfUser);

// Route to update a property by its ID => protect
router.put("/update-property/:id", updateProperty);

// Route to delete a property by its ID => protect
router.delete("/delete-property/:id", deleteProperty);

// Route to like a property  => protect
router.put("/wishlist/:id", likeProperty);

module.exports = router;
