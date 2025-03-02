const User = require("../models/user");
const Role = require("../models/role")
const UserRole = require("../models/userrole");
const jwt = require("jsonwebtoken");
const hashPassword = require("../utils/hashPassword");
require("dotenv").config();

const registerUser = async (username, email, password) => {
  if (!username || !email || !password) {
    throw new Error("Missing information");
  }

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser)
     throw new Error('Email already in use');

  const hashedPassword = await hashPassword(password);
  const newUser = await User.create({ username, email, password: hashedPassword });

  const customerRole = await Role.findOne({ where: { role_name: 'customer' } });
  if (!customerRole) throw new Error('Role customer không tồn tại');

  await UserRole.create({ user_id: newUser.user_id, role_id: customerRole.role_id });

  return newUser; 
};

const loginUser = async (email, password) => {
  if (!email || !password) {
    throw new Error("Missing email or password");
  }

  const user = await User.findOne({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return { token, user };
};


module.exports = { registerUser, loginUser };
