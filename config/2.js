const jwt = require("jsonwebtoken");

const oldToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo2LCJlbWFpbCI6ImNoYXJsaWVAZXhhbXBsZS5jb20iLCJyb2xlcyI6WyJjdXN0b21lciIsInZlbmRvciJdLCJpYXQiOjE3NDk5MjExNjUsImV4cCI6MTc0OTk1NzE2NX0.DTwzuuDwlF-DxOsAi7V2gU-Dm2r_qsIlTCbAPem1vmY";
const secretKey = "your_secret_key_here";

// 1. Giải mã token cũ (không cần verify chữ ký nếu chỉ muốn sửa)
const decoded = jwt.decode(oldToken);

// 2. Chỉnh sửa payload (thêm 'admin' vào mảng roles nếu chưa có)
if (!decoded.roles.includes("admin")) {
  decoded.roles.push("admin");
}

// 3. Xóa iat và exp nếu muốn JWT tự tạo lại giá trị mới, hoặc bạn có thể giữ nguyên
delete decoded.iat;
delete decoded.exp;

// 4. Ký lại token mới với thời gian sống (ví dụ 10 giờ)
const newToken = jwt.sign(decoded, secretKey, { expiresIn: "10h" });

console.log("New Token:", newToken);
