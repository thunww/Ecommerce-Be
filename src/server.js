require('dotenv').config();
const http = require('http');
const app = require('./app');
const { setupWebSocket } = require('./websocket/chatSocket');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 8080;

sequelize.sync().then(() => {
  const server = http.createServer(app);

  setupWebSocket(server); // Gắn WebSocket lên server này

  // server.listen(PORT, () => {
  //   console.log(`Server is running on port ${PORT}`);
  // });
});
