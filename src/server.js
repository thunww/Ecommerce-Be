const dotenv = require("dotenv");
const sequelize = require("./config/database");
const app = require("./app");

dotenv.config();

// Kết nối database & chạy server
sequelize
  .sync()
  .then(() => {
    console.log("Database connected");
    app.listen(8080, () => console.log("Server running on port 8080"));
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });
