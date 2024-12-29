const express = require("express");
const orderController = require("../controller/orderController");
const router = express.Router();
const verifyToken = require("../middleware/verifyTokenMiddleware");

router.post("/neworder", orderController.createOrder);
router.get("/getorder/:id", orderController.getorders);
router.get("/getallorder", orderController.getallorders);
router.delete("/deleteorder/:id", orderController.deleteorder);
router.patch("/updateorderstatus/:id", orderController.shippingStatusUpdate);
router.patch("/updatepaymentstatus/:id", orderController.paymentStatusUpdate);
router.get("/getUserOrders/:id", orderController.numOfOrdersForSpecificUser);
router.post("/trackingId", orderController.addTrackingId);
module.exports = router;
