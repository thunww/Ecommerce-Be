const { sequelize } = require('./models'); // Đường dẫn đến models/index.js

sequelize.sync({ force: true }) // 'force: true' xóa bảng cũ và tạo lại; dùng 'alter: true' để không mất dữ liệu
  .then(() => console.log(" Database synced, tables created!"))
  .catch((err) => console.error("Error syncing database:", err));
