const dotenv = require("dotenv");
const sequelize = require("./config/database");
const app = require("./app");
const http = require('http');
// const { setupWebSocket } = require('./websocket/chatSocket');

dotenv.config();

// Kết nối database & chạy server
sequelize
  .sync()
  .then(() => {
    console.log("Database connected");
    const server = http.createServer(app);

    // Thiết lập WebSocket server
    // setupWebSocket(server);

    server.listen(8080, () => console.log("Server running on port 8080"));
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });
