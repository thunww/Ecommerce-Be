const express = require("express");

const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const { sequelize } = require("./models");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
// const adminRoutes = require("./routes/adminRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const configCORS = require("./config/cors");
const app = express();
const bodyParser = require("body-parser");
const usersRoutes = require("./routes/usersRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const addressRoutes = require("./routes/addressRoutes");
const shopRoutes = require("./routes/shopRoutes");
const couponRoutes = require("./routes/couponRoutes");
const chatRoutes = require("./routes/chatRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const shipperRoutes = require("./routes/shipperRoutes");
const { handleUploadError } = require("./middleware/upload");
const { setupSocketServer } = require("./websocket/chatSocket");
const http = require("http");
const cors = require('cors');
app.use(cors()); // Cho phép mọi domain – có thể cấu hình kỹ hơn sau
// Middleware
app.use(helmet());
app.use(compression());
configCORS(app);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Cho form-data

// Log middleware để debug
app.use((req, res, next) => {
  next();
});

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/", usersRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/wishlist", wishlistRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/addresses", addressRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/coupons", couponRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/shops", shopRoutes);
app.use("/api/v1/vendor", vendorRoutes);
app.use("/api/v1/shippers", shipperRoutes);
// app.use("/api/v1/admin", adminRoutes);

// Upload error handling
app.use(handleUploadError);

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

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
setupSocketServer(server);
sequelize.sync().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});


module.exports = app; 