const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const hashPassword = require("../utils/hashPassword");
require("dotenv").config();

const registerUser = async (username, email, password, role) => {
  if (!username || !email || !password) {
    throw new Error("Missing information");
  }

  const hashedPassword = await hashPassword(password);
  return await User.create({ username, email, password: hashedPassword, role });
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
