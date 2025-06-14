# 🖥️ E-Commerce Backend

Đây là mã nguồn **Backend** của hệ thống **E-Commerce** – đồ án môn học tại **Học viện Công nghệ Bưu chính Viễn thông – Cơ sở TP.HCM**.

---

## Thông tin đồ án

- **Tên đề tài:** Hệ thống E-Commerce  
**Nhóm 3 – Thành viên:**
- N22DCAT001 – Nguyễn Văn An  
- N22DCAT018 – Trần Xuân Đông  
- N22DCAT038 – Lê Đình Nghĩa  
- N22DCAT050 – Trần Gia Thân  

---

## Liên kết liên quan

- [Frontend Repository](https://github.com/thunww/Ecommerce-Fe)  
- [Backend Repository](https://github.com/thunww/Ecommerce-Be)

---

## Mô tả hệ thống

Hệ thống **Backend** được xây dựng bằng **Node.js + Express**, kết hợp **Sequelize ORM** để quản lý cơ sở dữ liệu, cung cấp API cho hệ thống thương mại điện tử.

### Các chức năng chính:

- Đăng ký / Đăng nhập người dùng  
- Phân quyền theo vai trò (Admin, Customer, Seller, Shipper)  
- Quản lý sản phẩm, danh mục, shop  
- Xử lý đơn hàng, giỏ hàng, đánh giá  
- Hỗ trợ upload ảnh sản phẩm  
- Bảo mật với JWT và mã hoá mật khẩu bằng Bcrypt  

---

## ⚙️ Công nghệ sử dụng

- **Node.js + Express**
- **Sequelize ORM**
- **MySQL**
- **JWT** – xác thực & phân quyền
- **Bcrypt** – mã hoá mật khẩu
- **Multer** – upload file
- **Dotenv** – quản lý biến môi trường
- **RESTful API**

---

## 🚀 Cài đặt & khởi chạy

### 1. Clone dự án, cài gói, khởi tạo database
```bash
git clone https://github.com/thunww/Ecommerce-Be.git
cd Ecommerce-Be

# Cài đặt các package
npm install

# Tạo file .env trong thư mục gốc và cấu hình ví dụ:
# (Tạo bằng lệnh: touch .env)
echo "PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=ecommerce
ACCESS_TOKEN_SECRET=your_jwt_secret" > .env

# Tạo cơ sở dữ liệu
npx sequelize db:create

# Chạy migration để tạo bảng
npx sequelize-cli db:migrate

# Seed dữ liệu mẫu (tuỳ chọn)
npx sequelize db:seed:all

# (Tuỳ chọn) Xoá DB
# npx sequelize db:drop

# (Tuỳ chọn) Undo migration
# npx sequelize-cli db:migrate:undo:all
# Chạy server
npm run dev
