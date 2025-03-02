const User = require("../models/user");
const Role = require("../models/role");
const UserRole = require("../models/userrole");
const bcrypt = require("bcrypt");
const { generateToken } = require("../config/jwt");
const hashPassword = require("../utils/hashPassword");

const registerUser = async (username, email, password, roleNames) => {
  if (!username || !email || !password || !roleNames.length) {
    throw new Error("Missing required fields");
  }

  // Kiểm tra email đã tồn tại chưa
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error("Email is already in use");
  }

  const hashedPassword = await hashPassword(password);
  const newUser = await User.create({ username, email, password: hashedPassword });

  // Tìm vai trò trong database
  const roles = await Role.findAll({ where: { name: roleNames } });

  if (!roles.length) {
    throw new Error("Invalid role(s) provided");
  }

  // Gán vai trò cho người dùng
  await newUser.setRoles(roles);

  const token = generateToken({ id: newUser.id, email: newUser.email, roles: roles.map((r) => r.name) });

  return { token, user: newUser, roles };
};

const loginUser = async (email, password) => {
  if (!email || !password) {
    throw new Error("Missing email or password");
  }

  const user = await User.findOne({ where: { email }, include: Role });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid credentials");
  }

  const roles = user.Roles.map((r) => r.name);
  const token = generateToken({ id: user.id, email: user.email, roles });

  return { token, user, roles };
};

module.exports = { registerUser, loginUser };
