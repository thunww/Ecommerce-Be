const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const configCORS = require("./config/cors");
const app = express();
const bodyParser = require("body-parser");
const adminRoutes = require("./routes/adminRoutes");
// Middleware
app.use(express.json());

configCORS(app);
app.use(express.urlencoded({ extended: true })); // Cho form-data

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/", userRoutes);
app.use("/api/v1/admin", adminRoutes);
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
