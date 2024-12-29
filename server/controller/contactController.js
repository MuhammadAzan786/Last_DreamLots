const { sendMessageEmail } = require("../mailtrap/email");
const Contact = require("../model/contactModel");

// Create a new contact message
exports.createMessage = async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    // Send email notification to admin with the new message details
    await sendMessageEmail(
      req.body.email,
      req.body.name,
      req.body.subject,
      req.body.phone,
      req.body.message
    );
    res.status(201).json({
      message: "Message sent successfully!",
      data: contact,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to send message.",
      error: error.message,
    });
  }
};

// Get all contact messages
exports.getAllMessages = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let start, end, messages;

    if (startDate && endDate) {
      // Normalize start date to the start of the day
      start = new Date(startDate);
      start.setUTCHours(0, 0, 0, 0);

      // Normalize end date to the end of the day
      end = new Date(endDate);
      end.setUTCHours(23, 59, 59, 999);

      messages = await Contact.find({
        createdAt: {
          $gte: start,
          $lt: end,
        },
      });
    } else {
      start = startDate ? new Date(startDate) : new Date("1970-01-01");
      start.setUTCHours(0, 0, 0, 0);

      end = endDate ? new Date(endDate) : new Date();
      end.setUTCHours(23, 59, 59, 999);

      messages = await Contact.find({
        createdAt: {
          $gte: start,
          $lt: end,
        },
      });
    }

    console.log("start", start, "end", end);

    res.status(200).json({
      message: "Messages retrieved successfully!",
      data: messages,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve messages.",
      error: error.message,
    });
  }
};

// Get a single contact message by ID
exports.getMessageById = async (req, res) => {
  const { id } = req.params;
  try {
    const message = await Contact.findById(id);
    if (!message) {
      return res.status(404).json({
        message: "Message not found",
      });
    }
    res.status(200).json({
      message: "Message retrieved successfully!",
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve message.",
      error: error.message,
    });
  }
};
