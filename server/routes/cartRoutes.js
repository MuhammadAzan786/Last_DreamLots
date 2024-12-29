const express = require("express");
const router = express.Router();
const cartController = require("../controller/cartController"); 
const verifyToken = require("../middleware/verifyTokenMiddleware.js")



// Cart Routes 
router.post("/addItem",verifyToken, cartController.addToCart);
router.get("/getCart",verifyToken, cartController.getCart); 
router.put("/updateQuantity",verifyToken, cartController.updateCartItemQuantity);
router.delete("/removeItem/:itemId",verifyToken, cartController.removeItemFromCart);
router.delete("/clearCart",verifyToken, cartController.clearCart); 

module.exports = router;