const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const adminRoutes = require("./routes/adminRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const configCORS = require("./config/cors");
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config();
// Middleware
app.use(express.json());
app.use(cors());
configCORS(app);
app.use(express.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true })); // Cho form-data

// Log middleware để debug
app.use((req, res, next) => {
  console.log("Request Body:", req.body);
  console.log("Request Headers:", req.headers);
  next();
});
// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/vendor", vendorRoutes);
app.use("/uploads", express.static("uploads"));

// Sử dụng API routes
app.use("/api/products", productRoutes);

// Xử lý lỗi 404 (Not Found)
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

module.exports = app;
