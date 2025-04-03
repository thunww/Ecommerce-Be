const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const { sequelize } = require("./models");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const adminRoutes = require("./routes/adminRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const configCORS = require("./config/cors");
const app = express();
const bodyParser = require("body-parser");

const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const addressRoutes = require("./routes/addressRoutes");
// Middleware
app.use(helmet());
app.use(compression());
configCORS(app);
app.use(morgan("dev"));
app.use(express.json());
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

app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/addresses", addressRoutes);

const shopRoutes = require("./routes/shopRoutes");
app.use("/api/shop", shopRoutes);

// Xử lý lỗi 404 (Not Found)
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

// Database connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Kết nối database thành công.");
  })
  .catch((err) => {
    console.error("Không thể kết nối database:", err);
  });

module.exports = app;
