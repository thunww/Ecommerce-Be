const crypto = require("crypto");

/**
 * Hàm băm mật khẩu với SHA-256
 * @param {string} password - mật khẩu gốc
 * @returns {string} - chuỗi băm dạng hex
 */
const hashPassword = (password) => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

/**
 * Hàm so sánh mật khẩu (dạng đơn giản - không có salt)
 * @param {string} password - mật khẩu người dùng nhập
 * @param {string} hashedPassword - mật khẩu đã băm lưu trong DB
 * @returns {boolean}
 */
const comparePassword = (password, hashedPassword) => {
  const hashedInput = hashPassword(password);
  return hashedInput === hashedPassword;
};

module.exports = {
  hashPassword,
  comparePassword,
};
