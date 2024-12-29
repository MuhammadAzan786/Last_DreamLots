const express = require("express");
const router = express.Router();

const virtualTourController = require("../controller/virtualTourController");
const multerUploader = require("../middleware/VirtualTourMulterConfig");
router.post(
  "/createVirtualTour",
  multerUploader,
  virtualTourController.addVirtualTour
);

router.get("/getAllVirtualTours", virtualTourController.getAllVirtualTours);
router.get(
  "/getAllVirtualToursBySellerId/:id",
  virtualTourController.getAllVirtualToursBySellerId
);

module.exports = router;
