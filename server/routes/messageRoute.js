const express = require("express");
const router = express.Router();
const contactController = require("../controller/contactController");

// Route to create a new contact message
router.post("/messages", contactController.createMessage);

// Route to get all contact messages
router.get("/messages", contactController.getAllMessages);

// Route to get a single contact message by ID
router.get("/messages/:id", contactController.getMessageById);

module.exports = router;
