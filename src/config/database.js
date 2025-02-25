const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,      // Tên DB từ .env
  process.env.DB_USER,      // User từ .env
  process.env.DB_PASSWORD,  // Password từ .env
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',       // Hoặc 'postgres', 'sqlite', ...
  }
);
