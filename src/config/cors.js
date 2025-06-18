const cors = require("cors");
require("dotenv").config();

const configCORS = (app) => {
  const corsOptions = {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  };

  app.use(cors(corsOptions));
};

module.exports = configCORS;
