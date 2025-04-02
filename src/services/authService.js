const User = require("../models/user");
const Role = require("../models/role");
const UserRole = require("../models/userrole");
const { hashPassword, comparePassword } = require("../utils/hashPassword");
const { generateToken, verifyToken } = require("../config/jwt");
const {
  sendVerificationEmail,
  sendResetPasswordEmail,
} = require("../utils/sendEmail");

// Thêm BlacklistedToken model để lưu các token đã vô hiệu hóa
const BlacklistedToken = require("../models/blacklistedToken");

const registerUser = async (username, email, password) => {
  if (!username || !email || !password) {
    throw new Error("Missing information");
  }
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) throw new Error("Email already in use");

  const hashedPassword = await hashPassword(password);
  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  const customerRole = await Role.findOne({ where: { role_name: "customer" } });
  await UserRole.create({
    user_id: newUser.user_id,
    role_id: customerRole.role_id,
  });

  const verificationToken = generateToken({
    user_id: newUser.user_id,
    email: newUser.email,
    role: customerRole.role_name,
  });

  try {
    await sendVerificationEmail(newUser.email, verificationToken);
    console.log("Verification email sent successfully.");
  } catch (error) {
    console.log("Error sending verification email: ", error.message);
  }

  return {
    user_id: newUser.user_id,
    username: newUser.username,
    email: newUser.email,
    role: customerRole.role_name,
  };
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error("Email does not exist!");
  }

  const isMatch = comparePassword(password, user.password);
  if (!isMatch) {
    throw new Error("Incorrect password!");
  }

  if (user.status == "banned") {
    throw new Error("User account banned");
  }

  if (!user.is_verified) {
    throw new Error("Please verify your email first!");
  }

  const userRoles = await UserRole.findAll({
    where: { user_id: user.user_id },
  });
  if (userRoles.length === 0) {
    throw new Error("User has no assigned role!");
  }

  const roleIds = userRoles.map((ur) => ur.role_id);
  const roles = await Role.findAll({ where: { role_id: roleIds } });

  const roleNames = roles.map((role) => role.role_name);

  const token = generateToken({
    user_id: user.user_id,
    email: user.email,
    roles: roleNames,
  });

  return {
    message: "Login successful",
    token,
    user: {
      user_id: user.user_id,
      email: user.email,
      roles: roleNames, // Trả về danh sách role thay vì 1 role
    },
  };
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error("No user found with this email");
  }

  const resetToken = generateToken({ userId: user.user_id }, "1h");

  await sendResetPasswordEmail(email, resetToken);

  return { message: "Password reset email has been sent" };
};

const resetPassword = async (token, newPassword) => {
  if (!token) {
    throw new Error("Reset token is required");
  }

  const decoded = verifyToken(token);
  const userId = decoded.userId;

  const user = await User.findOne({ where: { user_id: userId } });
  if (!user) {
    throw new Error("User not found");
  }

  const hashedPassword = hashPassword(newPassword);
  user.password = hashedPassword;
  await user.save();

  return "Password has been successfully changed";
};

const logout = async (token) => {
  try {
    // Verify token trước khi blacklist
    const decoded = verifyToken(token);
    if (!decoded) {
      throw new Error("Token không hợp lệ");
    }

    // Thêm token vào blacklist với thời gian hết hạn
    await BlacklistedToken.create({
      token: token,
      expires_at: new Date(decoded.exp * 1000), // Chuyển đổi timestamp thành Date
      user_id: decoded.user_id,
    });
    console.log("Token đã được thêm vào blacklist");

    return { message: "Đăng xuất thành công" };
  } catch (error) {
    throw new Error("Lỗi khi đăng xuất: " + error.message);
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  logout,
};
