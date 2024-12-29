require("dotenv").config();
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const dbconnection = require("./database");
const path = require("path");

// Routes imports
const bannerRoutes = require("./routes/bannerRoutes");
const authenticationRoutes = require("./routes/authenticationRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const contactController = require("./routes/messageRoute");
const virtualTourRoutes = require("./routes/virtualTourRoutes");

const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  cors({
    // origin:[/\.?alnoorfans\.com$/],
    origin: process.env.FRONTEND_DOMAIN_NAME,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// Routes
app.use("/api/authentication", authenticationRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/contact", contactController);
app.use("/api/banner", bannerRoutes);
app.use("/api/virtualTours", virtualTourRoutes);

// Database connection
dbconnection();

// Server setup
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
